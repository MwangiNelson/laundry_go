export type LaundryOrderStatus =
  | "ongoing"
  | "ready"
  | "delivered"
  | "new"
  | "cancelled";

export type ILaundryOrderTab =
  | "all"
  | "scheduled"
  | "new"
  | "ongoing"
  | "ready"
  | "delivered"
  | "cancelled";

export const convertTabToDbStatus = (
  tab: ILaundryOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<ILaundryOrderTab, "all">, string> = {
    new: "New",
    scheduled: "Scheduled",
    ongoing: "Ongoing",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
