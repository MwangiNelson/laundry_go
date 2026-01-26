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
import { useActivateVendor } from "@/api/admin/vendors/use_vendor_managment.admin";
import { toast } from "sonner";

interface ActivateVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName?: string;
}

export const ActivateVendorModal: React.FC<ActivateVendorModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName = "Vendor",
}) => {
  const { mutateAsync: activateVendor, isPending } = useActivateVendor();

  const handleActivate = async () => {
    await activateVendor({ vendorId }).then(() => {
      onClose();
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate Vendor?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reactivate {vendorName}? This vendor will
            be able to accept orders again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleActivate}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending ? "Activating..." : "Activate"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
