import { faker } from "@faker-js/faker";

export type OrderStatus =
  | "new"
  | "in-progress"
  | "ready"
  | "delivered"
  | "cancelled";

export type ServiceType = "Laundry" | "Cleaning" | "Moving";

export interface IRecentOrderData {
  id: string;
  orderId: string;
  customerName: string;
  customerAvatar: string;
  service: ServiceType;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(789);

const services: ServiceType[] = ["Laundry", "Cleaning", "Moving"];
const statuses: OrderStatus[] = [
  "new",
  "in-progress",
  "ready",
  "delivered",
  "cancelled",
];

const generateRecentOrder = (index: number): IRecentOrderData => ({
  id: faker.string.uuid(),
  orderId: `#CM980${index + 1}`,
  customerName: faker.person.fullName(),
  customerAvatar: faker.image.avatarGitHub(),
  service: faker.helpers.arrayElement(services),
  price: faker.number.int({ min: 500, max: 15000 }),
  status: faker.helpers.arrayElement(statuses),
  createdAt: faker.date.recent({ days: 30 }).toISOString(),
});

// Generate sample data
export const recent_orders_data: IRecentOrderData[] = Array.from(
  { length: 10 },
  (_, i) => generateRecentOrder(i)
);

export const getRecentOrdersData = (): IRecentOrderData[] => {
  return recent_orders_data;
};
