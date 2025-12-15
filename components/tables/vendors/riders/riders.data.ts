import { faker } from "@faker-js/faker";

export type RiderStatus = "active" | "inactive";
export type RiderTab = "all" | "active" | "inactive";

export interface IRiderData {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  inProcessOrders: number;
  totalDeliveries: number;
  status: RiderStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(456);

const phoneNumbers = [
  "+254 711 999 333",
  "+254 700 111 222",
  "+254 723 888 901",
  "+254 712 555 444",
  "+254 701 222 333",
];

const riderNames = [
  "Natali Craig",
  "Kate Morrison",
  "Drew Cano",
  "Orlando Diggs",
  "Andi Lane",
  "Phoenix Baker",
  "Lana Steiner",
  "Demi Wilkinson",
  "Candice Wu",
  "Koray Okumus",
];

const generateRider = (index: number): IRiderData => {
  const createdAt = faker.date.recent({ days: 60 });
  const status = faker.helpers.arrayElement(["active", "inactive"] as const);

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(riderNames),
    avatar: faker.image.avatarGitHub(),
    phone: faker.helpers.arrayElement(phoneNumbers),
    inProcessOrders: faker.number.int({ min: 0, max: 8 }),
    totalDeliveries: faker.number.int({ min: 4, max: 86 }),
    status,
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const riders_data: IRiderData[] = Array.from({ length: 15 }, (_, i) =>
  generateRider(i)
);

export const getRidersData = (tab: RiderTab): IRiderData[] => {
  if (tab === "all") {
    return riders_data;
  }
  // For now, just return all data for other tabs
  // You can add filtering logic based on your business needs
  return riders_data;
};
