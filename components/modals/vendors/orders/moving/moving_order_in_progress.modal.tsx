"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Dot, ChevronDown } from "lucide-react";
import { CustomerProfile } from "../shared/customer_profile";
import { useMovingModal } from "./use_moving_modal";
import { MovingOrderOverview } from "./moving_order_overview";
import { format } from "date-fns";
export const MovingOrderInProgressModal = () => {
  const { order, setOpen } = useMovingModal();

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
    >
      <DialogTitle className="sr-only">Moving Order In Progress</DialogTitle>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-semibold text-foreground font-manrope">
              Moving
            </h2>
            <p className="text-xs text-muted-foreground tracking-[0.5px] font-manrope">
              {format(new Date(order!.created_at), "hh:mm a")} mins
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
              Order #{order.id.split("-")[0].toUpperCase()}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              className="border-secondary text-foreground bg-transparent hover:bg-primary/10 rounded-xl px-4 py-2 h-auto gap-2"
            >
              <Dot className="size-4 text-secondary" />
              <span className="text-sm font-normal font-manrope">
                {order.status}
              </span>
              {/* <ChevronDown className="size-4" /> */}
            </Button>
          </div>
        </div>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
          <CustomerProfile
            name={order.customer?.full_name ?? ""}
            email={order.customer?.email ?? ""}
            avatar={order.customer?.avatar_url ?? ""}
          />
          <MovingOrderOverview />
        </div>
      </div>
    </DialogContent>
  );
};
