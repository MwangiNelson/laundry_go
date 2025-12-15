export type LaundryOrderStatus =
  | "ongoing"
  | "ready"
  | "delivered"
  | "new"
  | "cancelled";

export type ILaundryOrderTab =
  | "all"
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
    ongoing: "Ongoing",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
