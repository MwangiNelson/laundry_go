"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Dot } from "lucide-react";
import { CustomerProfile } from "../shared";
import { useFumigationModal } from "./use_fumigation_modal";
import { FumigationOrderOverview } from "./fumigation_order_overview";

export const FumigationOrderInProgressModal = () => {
  const { order } = useFumigationModal();

  if (!order) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center">
          <p className="text-lg text-foreground font-manrope font-medium">
            Order {order.orderId}
          </p>
        </div>

        {/* Status Dropdown */}
        <Button
          variant="ghost"
          className="px-4 py-2 h-auto hover:bg-transparent"
        >
          <Badge
            variant="secondary"
            className="bg-transparent text-secondary px-0 py-0.5 flex items-center gap-2 hover:bg-transparent"
          >
            <Dot className="w-4 h-4 fill-secondary" />
            <span className="text-base font-manrope font-normal">Ongoing</span>
            <ChevronDown className="w-4 h-4" />
          </Badge>
        </Button>
      </div>

      {/* Customer Info */}
      <div className="flex flex-col gap-6">
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
