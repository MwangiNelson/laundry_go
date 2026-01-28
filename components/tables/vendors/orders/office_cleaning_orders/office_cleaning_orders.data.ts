export type OfficeCleaningOrderStatus =
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete"
  | "cancelled";

export type IOfficeCleaningOrderTab =
  | "all"
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete";

export const convertTabToDbStatus = (
  tab: IOfficeCleaningOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IOfficeCleaningOrderTab, "all">, string> = {
    under_review: "under_review",
    accepted: "accepted",
    in_processing: "in_processing",
    complete: "complete",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
