export type HouseCleaningOrderStatus =
  | "ongoing"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";

export type IHouseCleaningOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "complete"
  | "rated";

export const convertTabToDbStatus = (
  tab: IHouseCleaningOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IHouseCleaningOrderTab, "all">, string> = {
    new: "New",
    ongoing: "Ongoing",
    complete: "Completed",
    rated: "Rated",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
