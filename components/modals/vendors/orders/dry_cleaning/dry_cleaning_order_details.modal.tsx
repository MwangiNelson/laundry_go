"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useDryCleaningModal } from "./use_dry_cleaning_modal";
import { useFetchOrderTimeline } from "@/api/vendor/order/use_fetch_orders";
import {
  ProfileCard,
  StarRating,
  OrderTabs,
  ActivityLog,
  OrderProgressTimeline,
} from "../shared";
import { DryCleaningOrderOverview } from "./dry_cleaning_order_overview";

export const DryCleaningOrderDetailsModal = () => {
  const { order, setOpen } = useDryCleaningModal();
  const { data: timelineData } = useFetchOrderTimeline(order?.id || "");

  // Format timeline data for OrderProgressTimeline component
  const formatTimelineForProgress = () => {
    if (!timelineData || timelineData.length === 0) return [];

    const statusLabels: Record<string, string> = {
      under_review: "Under Review",
      accepted: "Accepted",
      in_pickup: "In Pickup",
      in_processing: "In Processing",
      ready_for_delivery: "Ready for Delivery",
      under_delivery: "Under Delivery",
      complete: "Complete",
      cancelled: "Cancelled",
    };

    return timelineData.map((entry) => ({
      label: statusLabels[entry.status] || entry.status,
      time: new Date(entry.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      completed: true,
    }));
  };

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-4xl p-0 rounded-3xl bg-background border border-border overflow-hidden "
    >
      <DialogTitle className="sr-only">Order Details</DialogTitle>

      <div className="p-6 space-y-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Order Number and Status */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-card-foreground font-manrope">
              Order #{order?.id.split("-")[0].toUpperCase()}
            </h2>
            <Badge className="bg-card border border-border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] px-2.5 h-8 rounded-md gap-1.5">
              <div className="size-4 flex items-center justify-center">
                <div
                  className={`size-2 rounded-full ${
                    order?.status === "complete"
                      ? "bg-green-500"
                      : order?.status === "cancelled"
                        ? "bg-red-500"
                        : order?.status === "under_delivery"
                          ? "bg-blue-500"
                          : order?.status === "ready_for_delivery"
                            ? "bg-green-400"
                            : order?.status === "in_processing"
                              ? "bg-orange-500"
                              : order?.status === "in_pickup"
                                ? "bg-purple-500"
                                : order?.status === "accepted"
                                  ? "bg-blue-400"
                                  : "bg-yellow-500"
                  }`}
                />
              </div>
              <span
                className={`text-base font-normal font-manrope ${
                  order?.status === "complete"
                    ? "text-green-500"
                    : order?.status === "cancelled"
                      ? "text-red-500"
                      : order?.status === "under_delivery"
                        ? "text-blue-500"
                        : order?.status === "ready_for_delivery"
                          ? "text-green-400"
                          : order?.status === "in_processing"
                            ? "text-orange-500"
                            : order?.status === "in_pickup"
                              ? "text-purple-500"
                              : order?.status === "accepted"
                                ? "text-blue-400"
                                : "text-yellow-500"
                }`}
              >
                {order?.status
                  ?.replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </Badge>
          </div>

          {/* Tabs */}
          <OrderTabs
            tabs={[
              {
                label: "Order Information",
                value: "order-info",
                content: (
                  <div className="space-y-6">
                    {/* Customer and Rider Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileCard
                        title="Customer Info"
                        name={order?.customer.full_name ?? "N/A"}
                        email={order?.customer.email || undefined}
                        phone={order?.customer.phone || undefined}
                        address={order?.delivery_details?.location || undefined}
                        avatar={order?.customer.avatar_url || ""}
                        avatarBorderColor="accent"
                      />

                      <ProfileCard
                        title="Rider Info"
                        name={order?.rider?.full_name ?? "N/A"}
                        phone={order?.rider?.phone || undefined}
                        avatar={order?.rider?.avatar_url || ""}
                        avatarBorderColor="secondary"
                      />
                    </div>
                    <DryCleaningOrderOverview />
                    <div className="flex gap-6">
                      <div className="flex-1 bg-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground font-normal font-manrope">
                            Customer Review
                          </p>
                          <StarRating rating={4.5} />
                        </div>
                        <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                          Clothes done well.
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                label: "Track Order",
                value: "track-order",
                content: (
                  <div className="grid grid-cols-1  gap-6">
                    <OrderProgressTimeline
                      steps={formatTimelineForProgress()}
                    />
                  </div>
                ),
              },
            ]}
            defaultValue="order-info"
          />
        </div>
      </div>
    </DialogContent>
  );
};
