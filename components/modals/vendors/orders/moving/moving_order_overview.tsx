interface MovingOrderOverviewProps {
  rooms: Array<{ name: string; quantity: number }>;
  totalAmount: number;
  pickupLocation: string;
  destinationLocation: string;
  pickupFloor: number;
  destinationFloor: number;
  timeSlot: string;
}

export const MovingOrderOverview = ({
  rooms,
  totalAmount,
  pickupLocation,
  destinationLocation,
  pickupFloor,
  destinationFloor,
  timeSlot,
}: MovingOrderOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Rooms Table */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border">
          <p className="text-sm text-muted-foreground font-normal font-manrope">
            Room
          </p>
          <p className="text-sm text-muted-foreground font-normal font-manrope">
            No.
          </p>
        </div>
        {rooms.map((room, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <p className="text-base text-foreground font-normal font-manrope">
              {room.name}
            </p>
            <p className="text-base text-foreground font-normal font-manrope">
              {room.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="flex justify-end">
        <p className="text-lg font-medium text-foreground font-manrope">
          kes {totalAmount.toLocaleString()}
        </p>
      </div>

      {/* Location Details */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <p className="text-muted-foreground font-normal font-manrope">
            Pickup: {pickupLocation}
          </p>
          <p className="text-foreground font-normal font-manrope">
            Floor: {pickupFloor}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-muted-foreground font-normal font-manrope">
            Destination: {destinationLocation}
          </p>
          <p className="text-foreground font-normal font-manrope">
            Floor: {destinationFloor}
          </p>
        </div>
        <p className="text-muted-foreground font-normal font-manrope">
          Moving time: {timeSlot}
        </p>
      </div>
    </div>
  );
};
