import { faker } from "@faker-js/faker";

export type HouseCleaningOrderStatus =
  | "ongoing"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";
export type HouseCleaningOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "complete"
  | "rated";

export interface IHouseCleaningOrderData {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  phone: string;
  rooms: string;
  service: string;
  cleaningDate: string;
  houseLocations: string;
  amount: number;
  status: HouseCleaningOrderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(125);

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
  "Block C, Riverside, Nairobi",
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

const statuses: HouseCleaningOrderStatus[] = [
  "ongoing",
  "complete",
  "new",
  "cancelled",
  "scheduled",
];

const generateHouseCleaningOrder = (index: number): IHouseCleaningOrderData => {
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
    houseLocations: locations[index % locations.length],
    amount: amounts[index % amounts.length],
    status: statuses[index % statuses.length],
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const houseCleaningOrders_data: IHouseCleaningOrderData[] = Array.from(
  { length: 11 },
  (_, i) => generateHouseCleaningOrder(i)
);

export const getHouseCleaningOrdersData = (
  tab: HouseCleaningOrderTab
): IHouseCleaningOrderData[] => {
  if (tab === "all") {
    return houseCleaningOrders_data;
  }

  return houseCleaningOrders_data.filter((order) => {
    if (tab === "new") return order.status === "new";
    if (tab === "ongoing") return order.status === "ongoing";
    if (tab === "complete") return order.status === "complete";
    if (tab === "rated") return order.status === "complete";
    return true;
  });
};
