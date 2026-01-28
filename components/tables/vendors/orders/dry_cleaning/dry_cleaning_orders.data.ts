export type DryCleaningOrderStatus =
  | "under_review"
  | "accepted"
  | "in_pickup"
  | "in_processing"
  | "ready_for_delivery"
  | "under_delivery"
  | "complete"
  | "cancelled";

export type IDryCleaningOrderTab =
  | "all"
  | "under_review"
  | "accepted"
  | "in_pickup"
  | "in_processing"
  | "ready_for_delivery"
  | "under_delivery"
  | "complete"
  | "cancelled";

export const convertTabToDbStatus = (
  tab: IDryCleaningOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IDryCleaningOrderTab, "all">, string> = {
    under_review: "under_review",
    accepted: "accepted",
    in_pickup: "in_pickup",
    in_processing: "in_processing",
    ready_for_delivery: "ready_for_delivery",
    under_delivery: "under_delivery",
    complete: "complete",
    cancelled: "cancelled",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
