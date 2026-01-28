"use client";
import { Dialog } from "@/components/ui/dialog";
import { useOfficeCleaningModal } from "./use_office_cleaning_modal";
import { NewOfficeCleaningOrderModal } from "./new_office_cleaning_order_modal";
import { OfficeCleaningOrderInProgressModal } from "./office_cleaning_order_in_progress.modal";

export const OfficeCleaningOrderMainModal = () => {
  const { open, setOpen, order } = useOfficeCleaningModal();
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
        orderStatus === "in_processing") && <NewOfficeCleaningOrderModal />}
      {orderStatus === "complete" && <OfficeCleaningOrderInProgressModal />}
    </Dialog>
  );
};
