"use client";

import React, { useState } from "react";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import {
  Protect,
  useVendorRole,
} from "@/components/context/vendors/vendor_gate";
import {
  TVendorBranchRow,
  useAddBranch,
  useRemoveBranch,
  useResendBranchInvitation,
  useVendorBranches,
} from "@/api/vendor/management/use_vendor_branches";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowClockwise,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { MapPin, Pencil, Building2 } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  sent: { label: "Invited", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
};

// ─── Branch Card ─────────────────────────────────────────────────────────────

const BranchCard = ({
  branch,
  parentVendorId,
  parentBusinessName,
}: {
  branch: TVendorBranchRow;
  parentVendorId: string;
  parentBusinessName: string;
}) => {
  const { mutate: resend, isPending: isResending } =
    useResendBranchInvitation();
  const { mutate: remove, isPending: isRemoving } = useRemoveBranch();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { canManageBranches } = useVendorRole();

  const status =
    STATUS_LABELS[branch.invitation_status ?? "pending"] ??
    STATUS_LABELS.pending;

  const handleResend = () => {
    if (!branch.email) {
      toast.error("No email address for this branch");
      return;
    }
    resend(
      {
        branchId: branch.id,
        branchEmail: branch.email,
        branchName: branch.branch_name,
        parentVendorId,
        parentBusinessName,
      },
      {
        onSuccess: () => toast.success(`Invitation resent to ${branch.email}`),
        onError: (err) =>
          toast.error(err.message || "Failed to resend invitation"),
      }
    );
  };

  const handleDelete = () => {
    remove(
      { branchId: branch.id, vendorId: parentVendorId },
      {
        onSuccess: () => {
          toast.success(`${branch.branch_name} removed`);
          setConfirmDelete(false);
        },
        onError: (err) =>
          toast.error(err.message || "Failed to remove branch"),
      }
    );
  };

  const rules =
    branch.rules && typeof branch.rules === "object" ? branch.rules : {};
  const contactPerson = rules.contact_person;
  const contactPhone = rules.contact_phone;
  const contactEmail = rules.contact_email;

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        {/* Branch header with actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-title">
                  {branch.branch_name}
                </p>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {branch.location?.description ??
                  branch.location?.main_text ??
                  "No location set"}
                {branch.email ? ` · ${branch.email}` : ""}
              </p>
            </div>
          </div>

          {canManageBranches && (
            <div className="flex items-center gap-2">
              {branch.invitation_status !== "accepted" && branch.email && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResend}
                  disabled={isResending}
                  className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                >
                  <ArrowClockwise
                    size={14}
                    className={isResending ? "animate-spin" : ""}
                  />
                  Resend
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                className="h-8 gap-1.5 rounded-lg px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash size={14} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Contact person nested inside card */}
        {contactPerson && (
          <div className="ml-6.5 mt-3 rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-sm font-medium text-title">{contactPerson}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {contactPhone}
              {contactEmail ? ` · ${contactEmail}` : ""}
            </p>
          </div>
        )}

        {(branch.invited_at || branch.accepted_at) && (
          <div className="ml-6.5 mt-2 flex gap-3">
            {branch.invited_at && (
              <p className="text-xs text-muted-foreground">
                Invited: {new Date(branch.invited_at).toLocaleDateString()}
              </p>
            )}
            {branch.accepted_at && (
              <p className="text-xs text-muted-foreground">
                Accepted: {new Date(branch.accepted_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium">{branch.branch_name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ─── Add Branch Dialog ───────────────────────────────────────────────────────

const AddBranchDialog = ({
  vendorId,
  open,
  onOpenChange,
}: {
  vendorId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [branchName, setBranchName] = useState("");
  const [email, setEmail] = useState("");
  const { mutate: addBranch, isPending } = useAddBranch();

  const isValid = branchName.trim().length >= 2 && email.includes("@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBranch(
      { vendorId, branchName: branchName.trim(), email: email.trim() },
      {
        onSuccess: () => {
          toast.success(`${branchName} added`);
          setBranchName("");
          setEmail("");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message || "Failed to add branch"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add branch</DialogTitle>
          <DialogDescription>
            Add a new branch location. An invitation email will be sent after
            creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch-name">Branch name</Label>
            <Input
              id="branch-name"
              placeholder="e.g. Westlands Branch"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-email">Contact email</Label>
            <Input
              id="branch-email"
              type="email"
              placeholder="branch@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? "Adding…" : "Add branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const VendorBranchesPageUI = () => {
  const { vendor } = useVendor();
  const { data: branches, isLoading } = useVendorBranches(vendor?.id);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-title font-manrope">
            Branches
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your branch locations and invitations.
          </p>
        </div>

        {/* Only owners of parent vendors can add branches */}
        <Protect condition={(p) => p.canManageBranches}>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            Add branch
          </Button>
        </Protect>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : !branches?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No branches added yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Add a branch to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              parentVendorId={vendor.id}
              parentBusinessName={vendor.business_name ?? ""}
            />
          ))}
        </div>
      )}

      <Protect condition={(p) => p.canManageBranches}>
        <AddBranchDialog
          vendorId={vendor.id}
          open={addOpen}
          onOpenChange={setAddOpen}
        />
      </Protect>
    </div>
  );
};
