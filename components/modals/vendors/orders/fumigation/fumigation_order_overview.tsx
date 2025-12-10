"use client";

import { useFumigationModal } from "./use_fumigation_modal";

export const FumigationOrderOverview = () => {
  const { order } = useFumigationModal();

  if (!order) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Rooms Table */}
      <div className="bg-card flex flex-col gap-6 p-6 rounded-2xl w-full">
        <div className="grid grid-cols-2 w-full">
          {/* Room Column */}
          <div className="flex flex-col">
            <div className="border-b border-border/20 h-10 min-h-10 px-3 py-2 flex items-center">
              <p className="text-sm text-muted-foreground font-manrope font-normal">
                Room
              </p>
            </div>
            {order.rooms.map((room, index) => (
              <div
                key={index}
                className={`border-b border-border/5 min-h-10 px-3 py-2 flex items-center ${
                  index === order.rooms.length - 1 ? "border-b-0" : ""
                }`}
              >
                <p className="text-base text-foreground font-manrope font-normal">
                  {room.name}
                </p>
              </div>
            ))}
          </div>

          {/* Quantity Column */}
          <div className="flex flex-col">
            <div className="border-b border-border/20 h-10 min-h-10 px-3 py-2 flex items-center">
              <p className="text-sm text-muted-foreground font-manrope font-normal">
                No.
              </p>
            </div>
            {order.rooms.map((room, index) => (
              <div
                key={index}
                className={`border-b border-border/5 min-h-10 px-3 py-2 flex items-center justify-end ${
                  index === order.rooms.length - 1 ? "border-b-0" : ""
                }`}
              >
                <p className="text-base text-foreground font-manrope font-normal">
                  {room.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-end w-full">
          <p className="text-base text-foreground font-manrope font-bold">
            kes {order.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div className="flex flex-col gap-4 text-base text-muted-foreground font-manrope font-normal">
        <p>Service: {order.serviceType}</p>
        <p>Location: {order.location}</p>
        <p>Cleaning time: {order.serviceTime}</p>
      </div>
    </div>
  );
};
