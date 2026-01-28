"use client";
import { Dialog } from "@/components/ui/dialog";
import { useDryCleaningModal } from "./use_dry_cleaning_modal";
import { NewDryCleaningOrderModal } from "./new_dry_cleaning_order_modal";
import { DryCleaningOrderInProgressModal } from "./dry_cleaning_order_in_progress.modal";
import { DryCleaningOrderDetailsModal } from "./dry_cleaning_order_details.modal";

export const NewDryCleaningOrderMainModal = () => {
  const { open, setOpen, order } = useDryCleaningModal();
  const orderStatus = order?.status;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      {(orderStatus === "under_review" ||
        orderStatus === "accepted" ||
        orderStatus === "in_pickup" ||
        orderStatus === "in_processing" ||
        orderStatus === "ready_for_delivery" ||
        orderStatus === "under_delivery") && <NewDryCleaningOrderModal />}
      {/* {orderStatus === "complete" && <DryCleaningOrderInProgressModal />} */}
      {orderStatus === "complete" && <DryCleaningOrderDetailsModal />}
    </Dialog>
  );
};
