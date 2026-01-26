"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApproveVendor } from "@/api/admin/vendors/use_vendor_managment.admin";
import { toast } from "sonner";

interface ApproveVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName?: string;
}

export const ApproveVendorModal: React.FC<ApproveVendorModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName = "Vendor",
}) => {
  const { mutateAsync: approveVendor, isPending } = useApproveVendor();

  const handleApprove = async () => {
    await approveVendor({ vendorId }).then(() => {
      onClose();
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Vendor?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve {vendorName}? This vendor will be
            able to accept orders immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} disabled={isPending}>
            {isPending ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
