import { faker } from "@faker-js/faker";

export type MovingOrderStatus =
  | "ongoing"
  | "in_transit"
  | "complete"
  | "new"
  | "cancelled"
  | "scheduled";
export type MovingOrderTab = "all" | "new" | "ongoing" | "complete" | "rated";

export interface IMovingOrderData {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  phone: string;
  rooms: string;
  movingDate: string;
  movingFrom: string;
  movingTo: string;
  amount: number;
  status: MovingOrderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(124);

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
  "Living Room",
  "Kitchen, Bedroom",
  "Bedroom, Dining Room",
  "Toilet, Utility Room",
  "Balcony, Bathroom",
];

const addresses = [
  "No. 12 Loresho Gardens, Loresho",
  "Block B, Palm Heights, Kileleshwa",
  "Argwings Kodhek Road, Kilimani",
  "Apartment 5, River View Residences, Ngong",
  "House 23, Runda Grove, Runda",
  "Flat 8, Valley Towers, Kilimani",
  "Unit 3A, Greenfield Apartments, Westlands",
  "No. 45 Madaraka Lane, Madaraka",
  "Apartment 12, Sunset Court, Riverside",
  "Block C, Riverside Residency, Riverside",
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

const statuses: MovingOrderStatus[] = [
  "ongoing",
  "in_transit",
  "complete",
  "new",
  "cancelled",
  "scheduled",
];

const generateMovingOrder = (index: number): IMovingOrderData => {
  const createdAt = faker.date.recent({ days: 60 });

  return {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    customerName: customerNames[index % customerNames.length],
    customerAvatar: faker.image.avatarGitHub(),
    phone: phoneNumbers[index % phoneNumbers.length],
    rooms: rooms[index % rooms.length],
    movingDate: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
    movingFrom: addresses[index % addresses.length],
    movingTo: addresses[(index + 1) % addresses.length],
    amount: amounts[index % amounts.length],
    status: statuses[index % statuses.length],
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const movingOrders_data: IMovingOrderData[] = Array.from(
  { length: 11 },
  (_, i) => generateMovingOrder(i)
);

export const getMovingOrdersData = (
  tab: MovingOrderTab
): IMovingOrderData[] => {
  if (tab === "all") {
    return movingOrders_data;
  }

  return movingOrders_data.filter((order) => {
    if (tab === "new") return order.status === "new";
    if (tab === "ongoing")
      return order.status === "ongoing" || order.status === "in_transit";
    if (tab === "complete") return order.status === "complete";
    if (tab === "rated") return order.status === "complete";
    return true;
  });
};
