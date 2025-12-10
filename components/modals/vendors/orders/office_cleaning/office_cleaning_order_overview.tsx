interface OfficeCleaningOrderOverviewProps {
  rooms: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  serviceType: string;
  location: string;
  timeSlot: string;
}

export const OfficeCleaningOrderOverview = ({
  rooms,
  totalAmount,
  serviceType,
  location,
  timeSlot,
}: OfficeCleaningOrderOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Rooms Table */}
      <div className="bg-card rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border">
            <p className="text-sm text-muted-foreground font-normal font-manrope">
              Room
            </p>
            <p className="text-sm text-muted-foreground font-normal font-manrope text-right">
              No.
            </p>
          </div>
          {rooms.map((room, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <p className="text-base text-foreground font-normal font-manrope">
                {room.name}
              </p>
              <p className="text-base text-foreground font-normal font-manrope text-right">
                {room.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="flex justify-end">
          <p className="text-base font-bold text-foreground font-manrope">
            kes {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-4 text-base text-muted-foreground font-normal font-manrope">
        <p>Service: {serviceType}</p>
        <p>Location: {location}</p>
        <p>Cleaning time: {timeSlot}</p>
      </div>
    </div>
  );
};
