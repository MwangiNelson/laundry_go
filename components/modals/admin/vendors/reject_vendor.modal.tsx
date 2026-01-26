"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRejectVendor } from "@/api/admin/vendors/use_vendor_managment.admin";
import { toast } from "sonner";

interface RejectVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName?: string;
}

export const RejectVendorModal: React.FC<RejectVendorModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  vendorName = "Vendor",
}) => {
  const [reason, setReason] = useState("");
  const { mutateAsync: rejectVendor, isPending } = useRejectVendor();

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    await rejectVendor({ vendorId, rejectionReason: reason });

    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Application?</DialogTitle>
          <DialogDescription>Confirmation screen</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              What's your reason?
            </label>
            <Textarea
              placeholder="Type something..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isPending || !reason.trim()}
            >
              {isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
