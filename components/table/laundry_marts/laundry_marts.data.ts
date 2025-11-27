import { faker } from "@faker-js/faker";

export type LaundryMartStatus = "active" | "pending" | "suspended" | "inactive";
export type LaundryMartTab = "all" | "active" | "pending" | "suspended";

export interface ILaundryMartData {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  revenue: number;
  rating: number;
  status: LaundryMartStatus;
  joinedDate: string;
  avatar: string;
}

// Seed faker for consistent data
faker.seed(456);

const generateLaundryMart = (status: LaundryMartStatus): ILaundryMartData => ({
  id: faker.string.uuid(),
  name: `${faker.company.name()} Laundry`,
  owner: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  location: `${faker.location.city()}, ${faker.location.country()}`,
  totalOrders: faker.number.int({ min: 50, max: 500 }),
  revenue: faker.number.int({ min: 10000, max: 100000 }),
  rating: Number(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })),
  status,
  joinedDate: faker.date.past({ years: 2 }).toISOString().split("T")[0],
  avatar: faker.image.avatarGitHub(),
});

// Generate sample data
export const laundry_marts_data: ILaundryMartData[] = [
  // Active laundry marts
  ...Array.from({ length: 15 }, () => generateLaundryMart("active")),
  // Pending laundry marts
  ...Array.from({ length: 8 }, () => generateLaundryMart("pending")),
  // Suspended laundry marts
  ...Array.from({ length: 4 }, () => generateLaundryMart("suspended")),
  // Inactive laundry marts
  ...Array.from({ length: 3 }, () => generateLaundryMart("inactive")),
];

export const getLaundryMartsData = (
  tab: LaundryMartTab
): ILaundryMartData[] => {
  if (tab === "all") {
    return laundry_marts_data;
  }
  return laundry_marts_data.filter((item) => item.status === tab);
};
