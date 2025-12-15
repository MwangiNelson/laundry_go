export type FumigationOrderStatus =
  | "ongoing"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";

export type IFumigationOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "complete"
  | "rated";

export const convertTabToDbStatus = (
  tab: IFumigationOrderTab
): string | undefined => {
  const statusMap: Record<Exclude<IFumigationOrderTab, "all">, string> = {
    new: "New",
    ongoing: "Ongoing",
    complete: "Completed",
    rated: "Rated",
  };

  return tab === "all" ? undefined : statusMap[tab];
};
