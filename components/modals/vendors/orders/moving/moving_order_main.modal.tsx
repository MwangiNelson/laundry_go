"use client";
import { Dialog } from "@/components/ui/dialog";
import { useMovingModal } from "./use_moving_modal";
import { NewMovingOrderModal } from "./new_moving_order_modal";
import { MovingOrderInProgressModal } from "./moving_order_in_progress.modal";
import { MovingOrderDetailsModal } from "./moving_order_details.modal";

export const MovingOrderMainModal = () => {
  const { open, setOpen, orderStatus } = useMovingModal();
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      {orderStatus === "new" && <NewMovingOrderModal />}
      {orderStatus === "ongoing" && <MovingOrderInProgressModal />}
      {orderStatus === "delivered" && <MovingOrderDetailsModal />}
    </Dialog>
  );
};
