"use client";
import { Dialog } from "@/components/ui/dialog";
import { useLaundryModal } from "./use_laundry_modal";
import { NewOrderModal } from "./new_laundry_order_modal";
import { LaundryOrderInProgressModal } from "./laundry_order_in_progress.modal";
import { LaundryOrderDetailsModal } from "./laundry_order_details.modal";

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
      {orderStatus === "ongoing" && <LaundryOrderInProgressModal />}
      {orderStatus === "delivered" && <LaundryOrderDetailsModal />}
    </Dialog>
  );
};
