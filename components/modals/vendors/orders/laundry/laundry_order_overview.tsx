import React from "react";
import { useLaundryModal } from "./use_laundry_modal";

export const LaundryOrderOverview = () => {
  const { order: orderData } = useLaundryModal();
  return (
    <div>
      <div className="space-y-6">
        <div className="bg-card rounded-2xl p-6 s">
          <div className="w-full">
            <div className="grid grid-cols-12 gap-3 border-b border-foreground/20 pb-2">
              <div className="col-span-5 px-3 py-2">
                <p className="text-sm text-muted-foreground font-normal font-manrope">
                  Order Item
                </p>
              </div>
              <div className="col-span-2 px-3 py-2">
                <p className="text-sm text-muted-foreground font-normal font-manrope">
                  No.
                </p>
              </div>
              <div className="col-span-5 px-3 py-2">
                <p className="text-sm text-muted-foreground font-normal font-manrope">
                  Price
                </p>
              </div>
            </div>

            <div className="divide-y divide-foreground/5">
              {orderData?.order_items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 py-2">
                  <div className="col-span-5 px-3 py-2">
                    <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                      {item.name}
                    </p>
                  </div>
                  <div className="col-span-2 px-3 py-2">
                    <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                      {item.quantity}
                    </p>
                  </div>
                  <div className="col-span-5 px-3 py-2">
                    <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <p className="text-base font-bold text-card-foreground font-manrope leading-[1.6]">
              kes {orderData?.total_price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground font-semibold font-manrope uppercase tracking-wide">
              Pickup Location
            </p>
            <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6] mt-1">
              {orderData?.pickup_details?.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold font-manrope uppercase tracking-wide">
              Delivery Location
            </p>
            <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6] mt-1">
              {orderData?.delivery_details?.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold font-manrope uppercase tracking-wide">
              Delivery Time
            </p>
            <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6] mt-1">
              {orderData?.delivery_details?.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
