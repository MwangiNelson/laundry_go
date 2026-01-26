"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IVendor } from "@/api/admin/vendors/use_fetch_vendors";
import { ApproveVendorModal } from "./approve_vendor.modal";
import { RejectVendorModal } from "./reject_vendor.modal";
import { SuspendVendorModal } from "./suspend_vendor.modal";
import { ActivateVendorModal } from "./activate_vendor.modal";
import {
  useActivateVendor,
  useApproveVendor,
} from "@/api/admin/vendors/use_vendor_managment.admin";

interface VendorActionsCellProps {
  vendor: IVendor;
}

export const VendorActionsCell: React.FC<VendorActionsCellProps> = ({
  vendor,
}) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const { mutateAsync: approveMutate } = useApproveVendor();
  const { mutateAsync: activateMutate } = useActivateVendor();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="cursor-pointer">
          <DropdownMenuItem className="cursor-pointer">
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Edit Vendor
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {vendor.status === "pending" && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setApproveOpen(true)}
              >
                Approve Vendor
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => setRejectOpen(true)}
              >
                Reject Vendor
              </DropdownMenuItem>
            </>
          )}
          {vendor.status === "approved" && (
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => setSuspendOpen(true)}
            >
              Suspend Vendor
            </DropdownMenuItem>
          )}
          {vendor.status === "suspended" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setActivateOpen(true)}
            >
              Activate Vendor
            </DropdownMenuItem>
          )}
          {vendor.status === "rejected" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setApproveOpen(true)}
            >
              Approve Vendor
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ApproveVendorModal
        isOpen={approveOpen}
        onClose={() => setApproveOpen(false)}
        vendorId={vendor.id}
        vendorName={vendor.business_name || "Vendor"}
      />

      <RejectVendorModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        vendorId={vendor.id}
        vendorName={vendor.business_name || "Vendor"}
      />

      <SuspendVendorModal
        isOpen={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        vendorId={vendor.id}
        vendorName={vendor.business_name || "Vendor"}
      />

      <ActivateVendorModal
        isOpen={activateOpen}
        onClose={() => setActivateOpen(false)}
        vendorId={vendor.id}
        vendorName={vendor.business_name || "Vendor"}
      />
    </>
  );
};
