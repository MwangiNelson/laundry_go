"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLaundryModal } from "./use_laundry_modal";
import { NewOrderModal } from "./new_laundry_order_modal";

export const NewLaundryOrderModal = () => {
  const { open, setOpen, orderStatus } = useLaundryModal();
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      {orderStatus === "new" && <NewOrderModal />}
    </Dialog>
  );
};
