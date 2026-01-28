"use client";
import { Dialog } from "@/components/ui/dialog";
import { useHouseCleaningModal } from "./use_house_cleaning_modal";
import { NewHouseCleaningOrderModal } from "./new_house_cleaning_order_modal";
import { HouseCleaningOrderInProgressModal } from "./house_cleaning_order_in_progress.modal";

export const HouseCleaningOrderMainModal = () => {
  const { open, setOpen, order } = useHouseCleaningModal();
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
        orderStatus === "in_processing") && <NewHouseCleaningOrderModal />}
      {orderStatus === "complete" && <HouseCleaningOrderInProgressModal />}
    </Dialog>
  );
};
