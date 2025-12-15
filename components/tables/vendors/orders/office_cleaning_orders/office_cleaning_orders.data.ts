export type OfficeCleaningOrderStatus =
  | "ongoing"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";

export type IOfficeCleaningOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "complete"
  | "rated";

export const convertTabToDbStatus = (
  tab: IOfficeCleaningOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IOfficeCleaningOrderTab, "all">, string> = {
    new: "New",
    ongoing: "Ongoing",
    complete: "Completed",
    rated: "Rated",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
