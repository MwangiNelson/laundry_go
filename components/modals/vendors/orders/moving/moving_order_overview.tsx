import React from "react";
import { useMovingModal } from "./use_moving_modal";

export const MovingOrderOverview = () => {
  const { order: orderData } = useMovingModal();

  return (
    <div className="bg-card rounded-2xl p-6 space-y-6">
      {/* Order Items */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border">
          <p className="text-sm text-muted-foreground font-normal font-manrope">
            Item
          </p>
          <p className="text-sm text-muted-foreground font-normal font-manrope">
            Qty
          </p>
        </div>
        {orderData?.order_items.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <p className="text-base text-foreground font-normal font-manrope">
              {item.service_item.name}
            </p>
            <p className="text-base text-foreground font-normal font-manrope">
              {item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="flex justify-end">
        <p className="text-lg font-medium text-foreground font-manrope">
          kes {orderData?.total_price.toFixed(2)}
        </p>
      </div>

      {/* Location Details */}
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-muted-foreground font-normal font-manrope">
            Pickup Location: {orderData?.pickup_details?.location}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground font-normal font-manrope">
            Delivery Location: {orderData?.delivery_details?.location}
          </p>
        </div>
        <p className="text-muted-foreground font-normal font-manrope">
          Time: {orderData?.delivery_details?.time}
        </p>
      </div>
    </div>
  );
};
