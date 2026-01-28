export type FumigationOrderStatus =
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete"
  | "cancelled";

export type IFumigationOrderTab =
  | "all"
  | "under_review"
  | "accepted"
  | "in_processing"
  | "complete";

export const convertTabToDbStatus = (
  tab: IFumigationOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IFumigationOrderTab, "all">, string> = {
    under_review: "under_review",
    accepted: "accepted",
    in_processing: "in_processing",
    complete: "complete",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
