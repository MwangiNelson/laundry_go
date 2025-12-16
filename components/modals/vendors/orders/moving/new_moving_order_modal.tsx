"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronDown } from "lucide-react";
import { useMovingModal } from "./use_moving_modal";
import { MovingOrderOverview } from "./moving_order_overview";
import { format } from "date-fns";
import { ProfileCard } from "../shared/profile_card";
import {
  useAcceptOrder,
  useRejectOrder,
  useUpdateOrderStatus,
} from "@/api/vendor/order/use_manage_orders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const NewMovingOrderModal = () => {
  const { order, setOpen } = useMovingModal();
  const { mutateAsync: accept_orders, isPending } = useAcceptOrder();
  const { mutateAsync: reject_orders, isPending: isRejecting } =
    useRejectOrder();
  const { mutateAsync: update_order_status, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();

  const handleAccept = async () => {
    await accept_orders({ order_id: order!.id });
    setOpen(false);
  };

  const handleReject = async () => {
    await reject_orders({ order_id: order!.id });
    setOpen(false);
  };

  const handleStatusChange = async (newStatus: "Completed" | "Cancelled") => {
    await update_order_status({ order_id: order!.id, status: newStatus });
    setOpen(false);
  };

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
    >
      <DialogTitle className="sr-only">New Moving Order</DialogTitle>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-semibold text-foreground font-manrope">
              Moving
            </h2>
            <p className="text-xs text-muted-foreground tracking-[0.5px] font-manrope">
              {format(new Date(order!.created_at), "MMM dd, yyyy 'at' hh:mm a")}
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
              Order #{order!.id.split("-")[0].toUpperCase()}
            </h3>
            <Badge className="bg-transparent border-none px-0 py-0 gap-0 h-auto">
              <div className="size-4 flex items-center justify-center">
                <div className="size-2 rounded-full bg-destructive" />
              </div>
              <span className="text-base font-normal text-destructive font-manrope">
                {order!.status}
              </span>
            </Badge>
          </div>

          {order!.status === "New" || order!.status === "Scheduled" ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="border-primary text-foreground bg-transparent hover:bg-primary/10 rounded-xl px-4 py-2 h-auto gap-2"
                onClick={handleReject}
                loading={isRejecting}
              >
                <X className="size-4" />
                <span className="text-sm font-normal font-manrope">
                  Reject Order
                </span>
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 h-auto gap-2"
                onClick={handleAccept}
                loading={isPending}
              >
                <Check className="size-4" />
                <span className="text-sm font-normal font-manrope">
                  Accept Order
                </span>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 h-auto gap-2">
                  <span className="text-sm font-normal font-manrope">
                    Update Status
                  </span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleStatusChange("Completed")}
                  disabled={isUpdatingStatus}
                >
                  <span className="font-manrope">Mark As Comple</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleStatusChange("Cancelled")}
                  disabled={isUpdatingStatus}
                  variant="destructive"
                >
                  <span className="font-manrope">Mark as Cancelled</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
          <ProfileCard
            title="Customer Info"
            name={order!.customer.full_name || "N/A"}
            email={order!.customer.email}
            phone={order!.customer.phone || undefined}
            avatar={order!.customer.avatar_url || ""}
          />
          <MovingOrderOverview />
        </div>
      </div>
    </DialogContent>
  );
};
