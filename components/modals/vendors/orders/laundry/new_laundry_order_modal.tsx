"use client";
import { useState } from "react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronDown, Truck } from "lucide-react";
import { CustomerProfile } from "./customer_profile";
import { useLaundryModal } from "./use_laundry_modal";
import { LaundryOrderOverview } from "./laundry_order_overview";
import { format } from "date-fns";
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
import { AssignRiderModal } from "./assign_rider_modal";
import { useAuth } from "@/components/context/auth_provider";

export const NewOrderModal = () => {
  const { vendor_id } = useAuth();
  const { order, setOpen } = useLaundryModal();
  const [assignRiderOpen, setAssignRiderOpen] = useState(false);
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
  const handleStatusChange = async (
    newStatus:
      | "in_pickup"
      | "in_processing"
      | "ready_for_delivery"
      | "under_delivery"
      | "complete"
  ) => {
    await update_order_status({ order_id: order!.id, status: newStatus });
    setOpen(false);
  };
  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
    >
      <DialogTitle className="sr-only">New Laundry Order</DialogTitle>

      <div className="p-6 space-y-6 ">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-semibold text-foreground font-manrope">
              Laundry
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

          {order.status === "under_review" ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                className="border-primary text-foreground bg-transparent hover:bg-primary/10 rounded-xl px-4 py-2 h-auto gap-2"
                onClick={handleReject}
                loading={isRejecting}
                disabled={!vendor_id}
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
                disabled={!vendor_id}
              >
                <Check className="size-4" />
                <span className="text-sm font-normal font-manrope">
                  Accept Order
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {(order.status === "under_delivery" ||
                order.status === "accepted" ||
                order.status === "ready_for_delivery") && (
                <Button
                  className="bg-primary/90 border border-primary text-foreground hover:bg-primary rounded-xl px-4 py-2 h-auto gap-2"
                  onClick={() => setAssignRiderOpen(true)}
                  disabled={!vendor_id}
                >
                  <Truck className="size-5" />
                  <span className="text-sm font-normal font-manrope">
                    {order.rider ? "Reassign Rider" : "Assign Rider"}
                  </span>
                </Button>
              )}
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
                  {order.status === "accepted" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("in_pickup")}
                        disabled={isUpdatingStatus || !vendor_id}
                      >
                        <span className="font-manrope">Mark as In Pickup</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {(order.status === "accepted" ||
                    order.status === "in_pickup") && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("in_processing")}
                        disabled={isUpdatingStatus || !vendor_id}
                      >
                        <span className="font-manrope">Mark as Processing</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {(order.status === "accepted" ||
                    order.status === "in_pickup" ||
                    order.status === "in_processing") && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("ready_for_delivery")}
                        disabled={isUpdatingStatus || !vendor_id}
                      >
                        <span className="font-manrope">Mark as Ready</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={() => handleStatusChange("under_delivery")}
                    disabled={isUpdatingStatus || !vendor_id}
                  >
                    <span className="font-manrope">
                      Mark as Out for Delivery
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className=" max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
          <CustomerProfile />
          <LaundryOrderOverview />
        </div>
      </div>

      {/* Assign Rider Modal */}
      <AssignRiderModal
        open={assignRiderOpen}
        onOpenChange={setAssignRiderOpen}
        orderId={order!.id}
      />
    </DialogContent>
  );
};
