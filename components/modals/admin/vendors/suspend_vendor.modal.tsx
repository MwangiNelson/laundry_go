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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSuspendVendor } from "@/api/admin/vendors/use_vendor_managment.admin";
import { toast } from "sonner";

interface SuspendVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName?: string;
}

const SUSPENSION_REASONS = [
  {
    value: "repeated_failure",
    label: "Repeated failure to fulfill customer orders",
    description: "Constant cancellations, delays, or no-shows.",
  },
  {
    value: "low_quality",
    label: "Low service quality or frequent complaints",
    description:
      "Customers report damaged laundry, poor cleaning, missing items, etc.",
  },
  {
    value: "platform_violation",
    label: "Violating platform rules",
    description:
      "Bypassing the platform for payments, spamming clients, or misusing customer data.",
  },
  {
    value: "fraud",
    label: "Suspected fraud",
    description: "Fake orders, fake reviews, or suspicious payment activity.",
  },
  {
    value: "unprofessional",
    label: "Unprofessional conduct",
    description: "Rude behavior toward customers, harassment, or threats.",
  },
  {
    value: "hygiene_safety",
    label: "Hygiene or safety violations",
    description:
      "Especially for laundry, fumigation, or moving services where safety standards matter.",
  },
  {
    value: "inactive",
    label: "Inactive or unresponsive vendor accounts",
    description:
      "Not updating order status, not replying to clients, or going missing mid-order.",
  },
  {
    value: "breach_contract",
    label: "Breach of contract",
    description:
      "Not meeting agreed SLAs, refusing refunds, or ignoring dispute resolutions.",
  },
];

export const SuspendVendorModal: React.FC<SuspendVendorModalProps> = ({
  isOpen,
  onClose,
  vendorId,
}) => {
  const [selectedReason, setSelectedReason] = useState(
    SUSPENSION_REASONS[0].value
  );
  const { mutateAsync: suspendVendor, isPending } = useSuspendVendor();

  const handleSuspend = async () => {
    const selectedReasonLabel = SUSPENSION_REASONS.find(
      (r) => r.value === selectedReason
    )?.label;

    await suspendVendor({
      vendorId,
      suspensionReason: selectedReasonLabel,
    }).then(() => {
      setSelectedReason(SUSPENSION_REASONS[0].value);
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>Suspend Vendor?</DialogTitle>
          <DialogDescription>
            Select the reason for suspension
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
            >
              <div className="space-y-3">
                {SUSPENSION_REASONS.map((reason) => (
                  <div
                    key={reason.value}
                    className="flex items-start space-x-3"
                  >
                    <RadioGroupItem
                      value={reason.value}
                      id={reason.value}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={reason.value}
                      className="flex flex-col cursor-pointer items-start justify-start"
                    >
                      <span className="font-medium">{reason.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {reason.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSuspend} disabled={isPending}>
              {isPending ? "Suspending..." : "Suspend"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
