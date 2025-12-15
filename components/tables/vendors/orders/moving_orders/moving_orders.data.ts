export type MovingOrderStatus =
  | "ongoing"
  | "in_transit"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";

export type IMovingOrderTab = "all" | "new" | "ongoing" | "complete" | "rated";

export const convertTabToDbStatus = (
  tab: IMovingOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IMovingOrderTab, "all">, string> = {
    new: "New",
    ongoing: "Ongoing",
    complete: "Completed",
    rated: "Rated",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
