"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { CustomerProfile } from "../shared";
import { useFumigationModal } from "./use_fumigation_modal";
import { FumigationOrderOverview } from "./fumigation_order_overview";

export const NewFumigationOrderModal = () => {
  const { order } = useFumigationModal();

  if (!order) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-6">
          <p className="text-lg text-foreground font-manrope font-medium">
            Order {order.orderId}
          </p>
          <Badge
            variant="destructive"
            className="bg-transparent text-destructive px-0 py-0.5 flex items-center gap-0 hover:bg-transparent"
          >
            <div className="w-4 h-4 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-destructive" />
            </div>
            <span className="text-base font-manrope font-normal">New</span>
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            className="border-primary text-foreground hover:bg-primary/10 font-manrope font-normal"
          >
            <X className="w-4 h-4" />
            Reject Order
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-foreground font-manrope font-normal">
            <Check className="w-4 h-4" />
            Accept Order
          </Button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex flex-col gap-6 px-6">
        <p className="text-sm text-muted-foreground font-manrope font-normal">
          Customer Info
        </p>
        <CustomerProfile
          name={order.customerName}
          email={order.customerEmail}
          avatar={order.customerAvatar}
        />
      </div>

      {/* Order Overview */}
      <FumigationOrderOverview />
    </div>
  );
};
