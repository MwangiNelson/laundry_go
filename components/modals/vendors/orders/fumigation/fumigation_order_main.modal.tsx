"use client";

import { Dialog } from "@/components/ui/dialog";
import { useFumigationModal } from "./use_fumigation_modal";
import { NewFumigationOrderModal } from "./new_fumigation_order_modal";
import { FumigationOrderInProgressModal } from "./fumigation_order_in_progress.modal";

export const FumigationOrderMainModal = () => {
  const { isOpen, closeModal, order } = useFumigationModal();
  const orderStatus = order?.status;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      {(orderStatus === "New" ||
        orderStatus === "Ongoing" ||
        orderStatus === "Scheduled" ||
        orderStatus === "Ready") && <NewFumigationOrderModal />}
      {orderStatus === "Completed" && <FumigationOrderInProgressModal />}
    </Dialog>
  );
};
