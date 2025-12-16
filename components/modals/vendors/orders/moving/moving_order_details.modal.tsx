"use client";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useMovingModal } from "./use_moving_modal";
import { faker } from "@faker-js/faker";
import {
  ProfileCard,
  StarRating,
  OrderTabs,
  ActivityLog,
  OrderProgressTimeline,
} from "../shared";
import { MovingOrderOverview } from "./moving_order_overview";

export const MovingOrderDetailsModal = () => {
  const { order, setOpen } = useMovingModal();

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-4xl p-0 rounded-3xl bg-background border border-border overflow-hidden"
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
                <div className="size-2 rounded-full bg-secondary" />
              </div>
              <span className="text-base font-normal text-secondary font-manrope">
                Delivered
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
                        name={order?.customer?.full_name ?? ""}
                        email={order?.customer.email}
                        phone={order?.customer.phone ?? ""}
                        // address={order?.customer.}
                        avatar={order?.customer.avatar_url ?? ""}
                        avatarBorderColor="accent"
                      />

                      <ProfileCard
                        title="Rider Info"
                        name={order?.rider?.full_name ?? ""}
                        phone={order?.rider?.phone ?? ""}
                        avatar={order?.rider?.avatar_url ?? ""}
                        avatarBorderColor="secondary"
                      />
                    </div>

                    {/* Moving Order Overview */}
                    <div className="bg-card rounded-2xl p-6">
                      <MovingOrderOverview />
                    </div>

                    {/* Reviews */}
                    <div className="flex gap-6">
                      <div className="flex-1 bg-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground font-normal font-manrope">
                            Rates and Reviews
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActivityLog
                      items={[
                        {
                          icon: "package",
                          text: "Order marked as Ready for Delivery",
                          time: "4:30 PM",
                        },
                        {
                          icon: "package",
                          text: "Order progressing started",
                          time: "11:00 AM",
                        },
                        {
                          icon: "motorcycle",
                          text: "Driver picked up order",
                          time: "10:00 AM",
                        },
                        {
                          icon: "package",
                          text: `Order placed by `,
                          time: "9:15 AM",
                        },
                      ]}
                    />
                    <OrderProgressTimeline
                      steps={[
                        {
                          label: "New (under review)",
                          time: "Nov 6, 9:15 AM",
                          completed: true,
                        },
                        {
                          label: "In progress",
                          time: "Nov 6, 10:00 AM (Driver: Kevin O.)",
                          completed: true,
                        },
                        {
                          label: "Ready (for delivery)",
                          time: "Nov 6, 11:00 AM",
                          completed: true,
                        },
                        {
                          label: "Delivered",
                          time: "Nov 6, 4:30 PM",
                          completed: true,
                        },
                      ]}
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
