export type MovingOrderStatus =
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete"
  | "cancelled";

export type IMovingOrderTab =
  | "all"
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete";

export const convertTabToDbStatus = (
  tab: IMovingOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IMovingOrderTab, "all">, string> = {
    under_review: "under_review",
    accepted: "accepted",
    in_processing: "in_processing",
    complete: "complete",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
