"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFumigationModal } from "./use_fumigation_modal";
import { NewFumigationOrderModal } from "./new_fumigation_order_modal";
import { FumigationOrderInProgressModal } from "./fumigation_order_in_progress.modal";

export const FumigationOrderMainModal = () => {
  const { isOpen, closeModal, orderStatus, order } = useFumigationModal();

  const renderModalContent = () => {
    switch (orderStatus) {
      case "new":
        return <NewFumigationOrderModal />;
      case "ongoing":
        return <FumigationOrderInProgressModal />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-[700px] bg-background border border-border/10 p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-end gap-2">
              <DialogTitle className="text-xl text-foreground font-manrope font-semibold">
                Fumigation
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-manrope font-normal tracking-wide pb-0.5">
                {order?.timeAgo}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="h-8 w-8 p-1 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};
