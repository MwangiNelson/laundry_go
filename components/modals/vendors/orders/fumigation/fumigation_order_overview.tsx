"use client";

import { useFumigationModal } from "./use_fumigation_modal";

export const FumigationOrderOverview = () => {
  const { order: orderData } = useFumigationModal();

  if (!orderData) return null;

  return (
    <div className="bg-card rounded-2xl p-6 space-y-6">
      {/* Order Items */}
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-3 border-b border-foreground/20 pb-2">
          <div className="col-span-5 px-3 py-2">
            <p className="text-sm text-muted-foreground font-normal font-manrope">
              Service Item
            </p>
          </div>
          <div className="col-span-4 px-3 py-2">
            <p className="text-sm text-muted-foreground font-normal font-manrope">
              Type
            </p>
          </div>
          <div className="col-span-3 px-3 py-2">
            <p className="text-sm text-muted-foreground font-normal font-manrope">
              Qty
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
              <div className="col-span-4 px-3 py-2">
                <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                  {item.service_option?.name}
                </p>
              </div>
              <div className="col-span-3 px-3 py-2">
                <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                  {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex items-center justify-end">
        <p className="text-base font-bold text-card-foreground font-manrope leading-[1.6]">
          kes {orderData?.total_price.toFixed(2)}
        </p>
      </div>

      {/* Service Details */}
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground font-normal font-manrope">
          Location: {orderData?.delivery_details?.location}
        </p>
        <p className="text-muted-foreground font-normal font-manrope">
          Time: {orderData?.delivery_details?.time}
        </p>
      </div>
    </div>
  );
};
