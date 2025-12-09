import { faker } from "@faker-js/faker";

export type OfficeCleaningOrderStatus =
  | "ongoing"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";
export type OfficeCleaningOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "complete"
  | "rated";

export interface IOfficeCleaningOrderData {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  phone: string;
  rooms: string;
  service: string;
  cleaningDate: string;
  officeLocations: string;
  amount: number;
  status: OfficeCleaningOrderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(126);

const customerNames = [
  "Hellen Cherop",
  "Ivy Kiptoo",
  "Nicholas Wairimu",
  "Nathan Kosgei",
  "Christine Sang",
  "Brenda Kiboro",
  "Catherine Kimemia",
  "Joshua Maina",
  "Michael Ndegwa",
  "Fortune Achieng",
];

const rooms = [
  "Single Office, Kitchen",
  "Open Plan Office",
  "Meeting Room, Hallway",
  "Reception Area, Bathroom",
  "Storage, Breakroom",
];

const services = [
  "Regular Cleaning",
  "Deep Cleaning",
  "Regular Cleaning",
  "Regular Cleaning",
  "Regular Cleaning",
  "Deep Cleaning",
  "Deep Cleaning",
  "Regular Cleaning",
  "Deep Cleaning",
  "Deep Cleaning",
];

const locations = [
  "Single Office, Kitchenette, 5th Floor, Tech Hub",
  "Open Plan, 3rd Floor, Business Park",
  "Meeting Rooms, Corridor, 7th Floor, Corporate Office",
  "Reception Desk, 1st Floor, Downtown Tower",
  "Warehouse, Break Room, Industrial Area",
  "Office Suite, Conference Room, Westlands",
  "Work Station, 6th Floor, Riverside Plaza",
  "Executive Offices, 10th Floor, Kilimani Court",
  "Shared Workspace, 2nd Floor, Innovation Hub",
  "Private Offices, Boardroom, Upper Hill Office Park",
];

const amounts = [
  87200, 51800, 42500, 53000, 62000, 31800, 92500, 2500, 2500, 2500,
];

const phoneNumbers = [
  "+254 711 999 333",
  "+254 700 111 222",
  "+254 723 888 901",
  "+254 712 555 444",
  "+254 701 222 333",
];

const statuses: OfficeCleaningOrderStatus[] = [
  "ongoing",
  "complete",
  "new",
  "cancelled",
  "scheduled",
];

const generateOfficeCleaningOrder = (
  index: number
): IOfficeCleaningOrderData => {
  const createdAt = faker.date.recent({ days: 60 });

  return {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    customerName: customerNames[index % customerNames.length],
    customerAvatar: faker.image.avatarGitHub(),
    phone: phoneNumbers[index % phoneNumbers.length],
    rooms: rooms[index % rooms.length],
    service: services[index % services.length],
    cleaningDate: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
    officeLocations: locations[index % locations.length],
    amount: amounts[index % amounts.length],
    status: statuses[index % statuses.length],
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const officeCleaningOrders_data: IOfficeCleaningOrderData[] = Array.from(
  { length: 11 },
  (_, i) => generateOfficeCleaningOrder(i)
);

export const getOfficeCleaningOrdersData = (
  tab: OfficeCleaningOrderTab
): IOfficeCleaningOrderData[] => {
  if (tab === "all") {
    return officeCleaningOrders_data;
  }

  return officeCleaningOrders_data.filter((order) => {
    if (tab === "new") return order.status === "new";
    if (tab === "ongoing") return order.status === "ongoing";
    if (tab === "complete") return order.status === "complete";
    if (tab === "rated") return order.status === "complete";
    return true;
  });
};
