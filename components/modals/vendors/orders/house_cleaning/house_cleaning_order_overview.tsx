interface HouseCleaningOrderOverviewProps {
  services: Array<{ name: string; rooms: number; price: number }>;
  totalAmount: number;
  location: string;
  timeSlot: string;
}

export const HouseCleaningOrderOverview = ({
  services,
  totalAmount,
  location,
  timeSlot,
}: HouseCleaningOrderOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Services Table */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border">
          <p className="text-sm text-muted-foreground font-normal font-manrope">
            Service
          </p>
          <p className="text-sm text-muted-foreground font-normal font-manrope">
            Rooms
          </p>
          <p className="text-sm text-muted-foreground font-normal font-manrope text-right">
            Price
          </p>
        </div>
        {services.map((service, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <p className="text-base text-foreground font-normal font-manrope">
              {service.name}
            </p>
            <p className="text-base text-foreground font-normal font-manrope">
              {service.rooms}
            </p>
            <p className="text-base text-foreground font-normal font-manrope text-right">
              kes {service.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="flex justify-end">
        <p className="text-lg font-medium text-foreground font-manrope">
          Total: kes {totalAmount.toLocaleString()}
        </p>
      </div>

      {/* Location and Time Details */}
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground font-normal font-manrope">
          Location: {location}
        </p>
        <p className="text-muted-foreground font-normal font-manrope">
          Service time: {timeSlot}
        </p>
      </div>
    </div>
  );
};
