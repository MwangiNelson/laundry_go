export type HouseCleaningOrderStatus =
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete"
  | "cancelled";

export type IHouseCleaningOrderTab =
  | "all"
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete";

export const convertTabToDbStatus = (
  tab: IHouseCleaningOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IHouseCleaningOrderTab, "all">, string> = {
    under_review: "under_review",
    accepted: "accepted",
    in_processing: "in_processing",
    complete: "complete",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
