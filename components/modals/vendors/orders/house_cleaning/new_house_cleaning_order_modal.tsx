"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { CustomerProfile } from "../shared/customer_profile";
import { useHouseCleaningModal } from "./use_house_cleaning_modal";
import { HouseCleaningOrderOverview } from "./house_cleaning_order_overview";

export const NewHouseCleaningOrderModal = () => {
  const { order, setOpen } = useHouseCleaningModal();
  const handleAccept = () => {};
  const handleReject = () => {};

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
    >
      <DialogTitle className="sr-only">New House Cleaning Order</DialogTitle>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-semibold text-foreground font-manrope">
              House Cleaning
            </h2>
            <p className="text-xs text-muted-foreground tracking-[0.5px] font-manrope">
              {order.minutesAgo} mins
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h3 className="text-lg font-medium text-foreground font-manrope">
              Order #{order.orderNumber}
            </h3>
            <Badge className="bg-transparent border-none px-0 py-0 gap-0 h-auto">
              <div className="size-4 flex items-center justify-center">
                <div className="size-2 rounded-full bg-destructive" />
              </div>
              <span className="text-base font-normal text-destructive font-manrope">
                New
              </span>
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              className="border-primary text-foreground bg-transparent hover:bg-primary/10 rounded-xl px-4 py-2 h-auto gap-2"
              onClick={handleReject}
            >
              <X className="size-4" />
              <span className="text-sm font-normal font-manrope">
                Reject Order
              </span>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 h-auto gap-2"
              onClick={handleAccept}
            >
              <Check className="size-4" />
              <span className="text-sm font-normal font-manrope">
                Accept Order
              </span>
            </Button>
          </div>
        </div>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
          <CustomerProfile
            name={order.customerName}
            email={order.customerEmail}
            avatar={order.customerAvatar}
          />
          <HouseCleaningOrderOverview
            services={order.services}
            totalAmount={order.totalAmount}
            location={order.location}
            timeSlot={order.timeSlot}
          />
        </div>
      </div>
    </DialogContent>
  );
};
