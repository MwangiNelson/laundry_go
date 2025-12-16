import { useOfficeCleaningModal } from "./use_office_cleaning_modal";

export const OfficeCleaningOrderOverview = () => {
  const { order } = useOfficeCleaningModal();

  return (
    <div className="space-y-6">
      {/* Services Grid */}
      <div className="bg-card rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border">
            <p className="text-sm text-muted-foreground font-normal font-manrope">
              Service
            </p>
            <p className="text-sm text-muted-foreground font-normal font-manrope text-right">
              Qty
            </p>
          </div>
          {order?.order_items && order.order_items.length > 0 ? (
            order.order_items.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-base text-foreground font-normal font-manrope">
                    {item.service_item?.name || "N/A"}
                  </p>
                  {item.service_option?.name && (
                    <p className="text-xs text-muted-foreground font-normal font-manrope">
                      {item.service_option.name}
                    </p>
                  )}
                </div>
                <p className="text-base text-foreground font-normal font-manrope text-right">
                  {item.quantity}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No items</p>
          )}
        </div>

        {/* Total Amount */}
        <div className="flex justify-end">
          <p className="text-base font-bold text-foreground font-manrope">
            kes {order?.total_price.toFixed(2).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pickup & Delivery Details */}
      {(order?.pickup_details || order?.delivery_details) && (
        <div className="space-y-4 text-sm text-muted-foreground font-normal font-manrope">
          {order?.pickup_details && (
            <p>Pickup: {order.pickup_details.location}</p>
          )}
          {order?.delivery_details && (
            <p>Delivery: {order.delivery_details.location}</p>
          )}
        </div>
      )}
    </div>
  );
};
