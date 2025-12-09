import { faker } from "@faker-js/faker";

export type FumigationOrderStatus =
  | "in_progress"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";
export type FumigationOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "complete"
  | "rated";

export interface IFumigationOrderData {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  phone: string;
  rooms: string;
  service: string;
  fumigationDate: string;
  location: string;
  amount: number;
  status: FumigationOrderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(127);

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
  "Living Room, Kitchen",
  "Kitchen, Bedroom",
  "Bedroom, Dining Room",
  "Toilet, Utility Room",
  "Balcony, Bathroom",
];

const services = [
  "Cockroach",
  "Bedbugs",
  "Rats",
  "Crickets",
  "Ants",
  "Cockroach",
  "Bedbugs",
  "Rats",
  "Crickets",
  "Ants",
];

const locations = [
  "Block C, River View, Nairobi",
  "Apartment 12, Sunset Court, Riverside",
  "No. 45 Madaraka Lane, Madaraka",
  "Unit 3A, Greenfield Apartments, Westlands",
  "Flat 8, Valley Towers, Kilimani",
  "House 23, Runda Grove, Runda",
  "Apartment 5, River View Residences, Ngong",
  "Argwings Kodhek Road, Kilimani",
  "Block B, Palm Heights, Kileleshwa",
  "No. 12 Loresho Gardens, Loresho",
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

const statuses: FumigationOrderStatus[] = [
  "in_progress",
  "complete",
  "new",
  "cancelled",
  "scheduled",
];

const generateFumigationOrder = (index: number): IFumigationOrderData => {
  const createdAt = faker.date.recent({ days: 60 });

  return {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    customerName: customerNames[index % customerNames.length],
    customerAvatar: faker.image.avatarGitHub(),
    phone: phoneNumbers[index % phoneNumbers.length],
    rooms: rooms[index % rooms.length],
    service: services[index % services.length],
    fumigationDate: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
    location: locations[index % locations.length],
    amount: amounts[index % amounts.length],
    status: statuses[index % statuses.length],
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const fumigationOrders_data: IFumigationOrderData[] = Array.from(
  { length: 11 },
  (_, i) => generateFumigationOrder(i)
);

export const getFumigationOrdersData = (
  tab: FumigationOrderTab
): IFumigationOrderData[] => {
  if (tab === "all") {
    return fumigationOrders_data;
  }

  return fumigationOrders_data.filter((order) => {
    if (tab === "new") return order.status === "new";
    if (tab === "ongoing") return order.status === "in_progress";
    if (tab === "complete") return order.status === "complete";
    if (tab === "rated") return order.status === "complete";
    return true;
  });
};
