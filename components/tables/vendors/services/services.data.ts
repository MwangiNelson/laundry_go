export type ServiceTab = "all" | "available" | "unavailable";
export type MainServiceTab =
  | "all"
  | "laundry"
  | "house-cleaning"
  | "office-cleaning"
  | "fumigation"
  | "moving";

export const convertMainServiceTabToId = (
  tab: MainServiceTab
): number | undefined => {
  const mapping: Record<MainServiceTab, number | undefined> = {
    all: undefined,
    laundry: 1,
    "house-cleaning": 2,
    "office-cleaning": 3,
    fumigation: 4,
    moving: 5,
  };
  return mapping[tab];
};

export const mainServiceTabs = [
  { value: "all", label: "All Services" },
  { value: "laundry", label: "Laundry" },
  { value: "house-cleaning", label: "House Cleaning" },
  { value: "office-cleaning", label: "Office Cleaning" },
  { value: "fumigation", label: "Fumigation" },
  { value: "moving", label: "Moving" },
];

export const serviceStatusTabs = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];
