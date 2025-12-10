import { Package, Bike } from "lucide-react";

interface ActivityLogItem {
  icon: "package" | "motorcycle";
  text: string;
  time: string;
}

interface ActivityLogProps {
  items: ActivityLogItem[];
}

export const ActivityLog = ({ items }: ActivityLogProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-normal font-manrope">
        Activity Log
      </p>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="bg-accent rounded-full p-1 shrink-0">
              {item.icon === "motorcycle" ? (
                <Bike className="size-4 text-card-foreground" />
              ) : (
                <Package className="size-4 text-card-foreground" />
              )}
            </div>
            <div className="flex-1 flex flex-col font-manrope font-normal">
              <p className="text-sm text-card-foreground leading-[1.5]">
                {item.text}
              </p>
              <p className="text-xs text-muted-foreground leading-[1.4] tracking-[0.5px]">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
