"use client";
import { Dialog } from "@/components/ui/dialog";
import { useLaundryModal } from "./use_laundry_modal";
import { NewOrderModal } from "./new_laundry_order_modal";
import { LaundryOrderInProgressModal } from "./laundry_order_in_progress.modal";
import { LaundryOrderDetailsModal } from "./laundry_order_details.modal";

export const NewLaundryOrderModal = () => {
  const { open, setOpen, order } = useLaundryModal();
  const orderStatus = order?.status;
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      {(orderStatus === "New" ||
        orderStatus === "Ongoing" ||
        orderStatus === "Ready") && <NewOrderModal />}
      {orderStatus === "Completed" && <LaundryOrderInProgressModal />}
      {orderStatus === "Delivered" && <LaundryOrderDetailsModal />}
    </Dialog>
  );
};
