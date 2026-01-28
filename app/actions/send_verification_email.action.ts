"use server";
import { render } from "@react-email/render";
import React from "react";
import { Resend } from "resend";
import ConfirmationEmail from "@/components/templates/confirmation_email";
import { createSupabaseServer } from "@/api/supabase/server";

const resend = new Resend(process.env.RESEND_PASS);

interface SendVerificationEmailParams {
  email: string;
  redirectTo?: string;
}

interface CreateVendorUserParams {
  email: string;
  password: string;
  full_name: string;
  redirectTo?: string;
}

export async function createVendorUser({
  email,
  password,
  full_name,
  redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/vendor`,
}: CreateVendorUserParams) {
  try {
    const supabase = await createSupabaseServer();

    // Create user with auth.admin
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

    if (userError) {
      console.error("Error creating user:", userError);
      return { success: false, error: userError.message };
    }

    if (!userData.user?.id) {
      return { success: false, error: "User ID not found after creation" };
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userData.user.id,
        email: email,
        full_name: full_name,
      })
      .eq("id", userData.user.id);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      return { success: false, error: profileError.message };
    }

    // Generate verification link
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: redirectTo,
        },
      });

    if (linkError) {
      console.error("Error generating verification link:", linkError);
      return { success: false, error: linkError.message };
    }

    if (!linkData.properties?.action_link) {
      return { success: false, error: "Failed to generate verification link" };
    }

    const actionLink = linkData.properties.action_link;

    // Render email template
    const emailHtml = await render(
      React.createElement(ConfirmationEmail, {
        actionLink,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      })
    );

    // Send verification email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "LaundryGo <laundrygo@meshack.dev>",
      to: [email],
      subject: "Verify your email address",
      html: emailHtml,
      text: `Verify your email address for LaundryGo. If the button does not work, copy and paste this link: ${actionLink}`,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return { success: false, error: emailError.message };
    }

    return {
      success: true,
      error: null,
      message: "User created and verification email sent successfully",
      user: userData.user,
      emailId: emailData?.id,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function sendVerificationEmail({
  email,
  redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/vendor`,
}: SendVerificationEmailParams) {
  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("Error generating verification link:", error);
      return { success: false, error: error.message };
    }

    if (!data.properties?.action_link) {
      return { success: false, error: "Failed to generate verification link" };
    }

    const actionLink = data.properties.action_link;

    const emailHtml = await render(
      React.createElement(ConfirmationEmail, {
        actionLink,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      })
    );

    // Send custom email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "LaundryGo <laundrygo@meshack.dev>",
      to: [email],
      subject: "Verify your email address",
      html: emailHtml,
      text: `Verify your email address for LaundryGo. If the button does not work, copy and paste this link: ${actionLink}`,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return { success: false, error: emailError.message };
    }

    return {
      success: true,
      error: null,
      message: "Verification email sent successfully",
      emailId: emailData?.id,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
