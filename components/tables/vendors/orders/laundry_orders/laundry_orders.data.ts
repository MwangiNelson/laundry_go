import { faker } from "@faker-js/faker";

export type LaundryOrderStatus =
  | "ongoing"
  | "ready"
  | "delivered"
  | "new"
  | "cancelled";
export type LaundryOrderTab =
  | "all"
  | "new"
  | "ongoing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface ILaundryOrderData {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  phone: string;
  orderItems: string;
  service: string;
  amount: number;
  pickupDate: string;
  location: string;
  status: LaundryOrderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(123);

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

const orderItems = [
  "Curtains/Sheets",
  "Sheets/Shoes",
  "Shoes/Carpets",
  "Beddings/Uniforms",
  "Uniforms/Clothes",
  "Clothes",
];

const services = [
  "Cleaning, Ironing",
  "Cleaning",
  "Cleaning, Ironing",
  "Cleaning",
  "Cleaning",
  "Cleaning, Ironing",
];

const locations = [
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

const amounts = [1200, 1800, 2500, 3000, 2000, 1800, 2500, 2500, 2500, 2500];

const phoneNumbers = [
  "+254 711 999 333",
  "+254 700 111 222",
  "+254 723 888 901",
  "+254 712 555 444",
  "+254 701 222 333",
];

const statuses: LaundryOrderStatus[] = [
  "ongoing",
  "ready",
  "delivered",
  "new",
  "cancelled",
];

const generateLaundryOrder = (index: number): ILaundryOrderData => {
  const createdAt = faker.date.recent({ days: 60 });

  return {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    customerName: customerNames[index % customerNames.length],
    customerAvatar: faker.image.avatarGitHub(),
    phone: phoneNumbers[index % phoneNumbers.length],
    orderItems: orderItems[index % orderItems.length],
    service: services[index % services.length],
    amount: amounts[index % amounts.length],
    pickupDate: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
    location: locations[index % locations.length],
    status: statuses[index % statuses.length],
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const laundryOrders_data: ILaundryOrderData[] = Array.from(
  { length: 11 },
  (_, i) => generateLaundryOrder(i)
);

export const getLaundryOrdersData = (
  tab: LaundryOrderTab
): ILaundryOrderData[] => {
  if (tab === "all") {
    return laundryOrders_data;
  }

  return laundryOrders_data.filter((order) => {
    if (tab === "new") return order.status === "new";
    if (tab === "ongoing") return order.status === "ongoing";
    if (tab === "ready") return order.status === "ready";
    if (tab === "delivered") return order.status === "delivered";
    if (tab === "cancelled") return order.status === "cancelled";
    return true;
  });
};
