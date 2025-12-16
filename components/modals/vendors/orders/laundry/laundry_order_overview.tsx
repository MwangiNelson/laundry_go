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
                  Service
                </p>
              </div>
            </div>

            <div className="divide-y divide-foreground/5">
              {orderData?.order_items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 py-2">
                  <div className="col-span-5 px-3 py-2">
                    <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                      {item.service_item.name}
                    </p>
                  </div>
                  <div className="col-span-2 px-3 py-2">
                    <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                      {item.quantity}
                    </p>
                  </div>
                  <div className="col-span-5 px-3 py-2">
                    <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                      {item.service_option?.name}
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
        <div className="flex items-end">
          <p className="text-base text-muted-foreground font-normal font-manrope leading-[1.6]">
            Pickup Location: {orderData?.delivery_details?.location}
            Delivery Location: {orderData?.pickup_details?.location}
            Time: {orderData?.delivery_details?.time}
          </p>
        </div>
      </div>
    </div>
  );
};
