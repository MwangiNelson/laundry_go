"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Dot, ChevronRight, ChevronDown } from "lucide-react";
import { CustomerProfile } from "./customer_profile";
import { useLaundryModal } from "./use_laundry_modal";
import { LaundryOrderOverview } from "./laundry_order_overview";

export const LaundryOrderInProgressModal = () => {
  const { order, open, setOpen } = useLaundryModal();
  const handleAccept = () => {};

  const handleReject = () => {};

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
    >
      <DialogTitle className="sr-only">Ongoing Order</DialogTitle>

      <div className="p-6 space-y-6 ">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-semibold text-foreground font-manrope">
              Laundry
            </h2>
            <h3 className="text-lg font-medium text-foreground font-manrope">
              Order #{order!.id.split("-")[0].toUpperCase()}
            </h3>
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
              Order #{order?.id}
            </h3>
            <Badge className="bg-transparent border-none px-0 py-0 gap-0 h-auto">
              <div className="size-4 flex items-center justify-center">
                <div className="size-2 rounded-full bg-destructive" />
              </div>
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              className="border-secondary text-foreground bg-transparent hover:bg-primary/10 rounded-xl px-4 py-2 h-auto gap-2"
              onClick={handleReject}
            >
              <Dot className="size-4" />
              <span className="text-sm font-normal font-manrope">Ongoing</span>
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
        <div className=" max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
          <CustomerProfile />
          <LaundryOrderOverview />
        </div>
      </div>
    </DialogContent>
  );
};
