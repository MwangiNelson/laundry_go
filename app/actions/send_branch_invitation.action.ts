"use server";

import { render } from "@react-email/render";
import React from "react";
import { Resend } from "resend";
import BranchInvitationEmail from "@/components/templates/branch_invitation_email";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

const getResendClient = () => {
  const resendApiKey = process.env.RESEND_API_KEY ?? process.env.RESEND_PASS;

  if (!resendApiKey) {
    throw new Error(
      "Missing Resend API key. Set RESEND_API_KEY in the deployment environment."
    );
  }

  return new Resend(resendApiKey);
};

/**
 * Create a Supabase admin client with the service role key.
 * This bypasses RLS, which is needed for admin operations like
 * creating profiles for other users.
 */
const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

interface SendBranchInvitationParams {
  branchId: string;
  branchEmail: string;
  branchName: string;
  parentVendorId: string;
  parentBusinessName: string;
}

interface SendAllBranchInvitationsParams {
  vendorId: string;
}

/**
 * Send an invitation email to a single branch contact.
 * Creates an auth user + profile + branch vendor record, then emails a magic link.
 */
export async function sendBranchInvitation({
  branchId,
  branchEmail,
  branchName,
  parentVendorId,
  parentBusinessName,
}: SendBranchInvitationParams) {
  try {
    const supabase = createAdminClient();
    const resend = getResendClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent('auth/set-new-password?next=/vendor/onboarding')}`;

    // 1. Create auth user (or find existing)
    let userId: string;
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: branchEmail,
        password: crypto.randomUUID(), // random password, they'll use magic link
        email_confirm: false,
      });

    if (userError) {
      // If user already exists, look them up
      if (userError.message?.includes("already been registered")) {
        const { data: existingUsers } =
          await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(
          (u) => u.email === branchEmail
        );
        if (!existing) {
          return { success: false, error: "User exists but could not be found" };
        }
        userId = existing.id;
      } else {
        console.error("Error creating branch user:", userError);
        return { success: false, error: userError.message };
      }
    } else {
      userId = userData.user.id;
    }

    // 2. Upsert profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: branchEmail,
          role: "vendor_user",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("Error creating branch profile:", profileError);
      return { success: false, error: profileError.message };
    }

    // 3. Create branch vendor record (sub-vendor linked to parent)
    // Check if a branch vendor already exists for this branch
    const { data: existingBranch } = await supabase
      .from("vendor_branches")
      .select("branch_vendor_id")
      .eq("id", branchId)
      .single();

    let branchVendorId = existingBranch?.branch_vendor_id ?? null;

    if (!branchVendorId) {
      const { data: branchVendor, error: vendorError } = await supabase
        .from("vendors")
        .insert({
          admin_id: userId,
          business_name: `${parentBusinessName} - ${branchName}`,
          business_type: "branch",
          email: branchEmail,
          parent_vendor_id: parentVendorId,
          profile_complete: false,
          status: "pending",
        })
        .select("id")
        .single();

      if (vendorError) {
        console.error("Error creating branch vendor:", vendorError);
        return { success: false, error: vendorError.message };
      }

      branchVendorId = branchVendor.id;

      // 4. Create vendor_users record (owner of branch)
      const { error: membershipError } = await supabase
        .from("vendor_users")
        .upsert(
          {
            user_id: userId,
            vendor_id: branchVendorId!,
            role: "owner",
          },
          { onConflict: "user_id,vendor_id" }
        );

      if (membershipError) {
        console.error("Error creating branch membership:", membershipError);
      }
    }

    // 5. Update vendor_branches with the branch vendor ID + invitation status
    const { error: branchUpdateError } = await supabase
      .from("vendor_branches")
      .update({
        branch_vendor_id: branchVendorId,
        invitation_status: "sent",
        invited_at: new Date().toISOString(),
      })
      .eq("id", branchId);

    if (branchUpdateError) {
      console.error("Error updating branch status:", branchUpdateError);
    }

    // 6. Generate recovery link so the invited user sets their password first
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "recovery",
        email: branchEmail,
        options: { redirectTo },
      });

    if (linkError) {
      console.error("Error generating invitation link:", linkError);
      return { success: false, error: linkError.message };
    }

    if (!linkData.properties?.action_link) {
      return { success: false, error: "Failed to generate invitation link" };
    }

    const actionLink = linkData.properties.action_link;

    // 7. Render and send email
    const emailHtml = await render(
      React.createElement(BranchInvitationEmail, {
        actionLink,
        parentBusinessName,
        branchName,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      })
    );

    console.log("[Branch Invitation] Sending email via Resend to:", branchEmail);
    const { error: emailError } = await resend.emails.send({
      from: "LaundryGo <laundrygo@glitexsolutions.co.ke>",
      to: [branchEmail],
      subject: `You're invited to manage ${branchName} on LaundryGo`,
      html: emailHtml,
      text: `You've been invited by ${parentBusinessName} to manage the ${branchName} branch on LaundryGo. Accept the invitation: ${actionLink}`,
    });

    if (emailError) {
      console.error("Error sending invitation email:", emailError);
      return { success: false, error: emailError.message };
    }

    return { success: true, error: null, branchVendorId };
  } catch (error) {
    console.error("Unexpected error sending branch invitation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send invitations to all branches of a vendor that haven't been invited yet.
 */
export async function sendAllBranchInvitations({
  vendorId,
}: SendAllBranchInvitationsParams) {
  try {
    const supabase = createAdminClient();

    // Get the parent vendor info
    const { data: parentVendor, error: vendorError } = await supabase
      .from("vendors")
      .select("id, business_name")
      .eq("id", vendorId)
      .single();

    if (vendorError || !parentVendor) {
      return { success: false, error: "Parent vendor not found" };
    }

    // Get all branches that haven't been sent an invite yet
    const { data: branches, error: branchesError } = await supabase
      .from("vendor_branches")
      .select("id, branch_name, email, invitation_status")
      .eq("vendor_id", vendorId);

    if (branchesError) {
      return { success: false, error: branchesError.message };
    }

    const pendingBranches = (branches ?? []).filter(
      (b) =>
        b.email &&
        (!b.invitation_status || b.invitation_status === "pending")
    );

    const results = [];
    for (const branch of pendingBranches) {
      const result = await sendBranchInvitation({
        branchId: branch.id,
        branchEmail: branch.email!,
        branchName: branch.branch_name,
        parentVendorId: parentVendor.id,
        parentBusinessName: parentVendor.business_name ?? "LaundryGo Business",
      });
      results.push({ branchId: branch.id, ...result });
    }

    const allSuccess = results.every((r) => r.success);
    return {
      success: allSuccess,
      error: allSuccess ? null : "Some invitations failed to send",
      results,
    };
  } catch (error) {
    console.error("Unexpected error sending all branch invitations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
