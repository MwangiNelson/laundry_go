"use client";
import { Dialog } from "@/components/ui/dialog";
import { useOfficeCleaningModal } from "./use_office_cleaning_modal";
import { NewOfficeCleaningOrderModal } from "./new_office_cleaning_order_modal";
import { OfficeCleaningOrderInProgressModal } from "./office_cleaning_order_in_progress.modal";

export const OfficeCleaningOrderMainModal = () => {
  const { open, setOpen, orderStatus } = useOfficeCleaningModal();
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      {orderStatus === "new" && <NewOfficeCleaningOrderModal />}
      {orderStatus === "ongoing" && <OfficeCleaningOrderInProgressModal />}
    </Dialog>
  );
};
