import { faker } from "@faker-js/faker";

export type TransactionStatus = "paid" | "refunded";
export type TransactionTab = "all" | "paid" | "refunded";

export interface IOrderItem {
  id: string;
  name: string;
  image: string;
}

export interface ITransactionData {
  id: string;
  orderId: string;
  customerName: string;
  customerAvatar: string;
  orderItems: IOrderItem[];
  amount: number;
  pickupTime: string;
  status: TransactionStatus;
  createdAt: string;
}

// Seed faker for consistent data
faker.seed(321);

const itemImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=64&h=64&fit=crop",
];

const generateOrderItems = (): IOrderItem[] => {
  const count = faker.number.int({ min: 2, max: 5 });
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    image: faker.helpers.arrayElement(itemImages),
  }));
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 2) return "A minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 2) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 2) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const generateTransaction = (
  index: number,
  status?: TransactionStatus
): ITransactionData => {
  const createdAt = faker.date.recent({ days: 30 });
  return {
    id: faker.string.uuid(),
    orderId: `#CM980${index + 1}`,
    customerName: faker.person.fullName(),
    customerAvatar: faker.image.avatarGitHub(),
    orderItems: generateOrderItems(),
    amount: faker.number.int({ min: 800, max: 5000 }),
    pickupTime: getRelativeTime(createdAt),
    status: status || faker.helpers.arrayElement(["paid", "refunded"] as const),
    createdAt: createdAt.toISOString(),
  };
};

// Generate sample data
export const transactions_data: ITransactionData[] = [
  // Mostly paid transactions
  ...Array.from({ length: 6 }, (_, i) => generateTransaction(i, "paid")),
  // Some refunded transactions
  ...Array.from({ length: 2 }, (_, i) =>
    generateTransaction(i + 6, "refunded")
  ),
];

export const getTransactionsData = (
  tab: TransactionTab
): ITransactionData[] => {
  if (tab === "all") {
    return transactions_data;
  }
  return transactions_data.filter((item) => item.status === tab);
};
