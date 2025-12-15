import { createContext, useContext, useState, ReactNode } from "react";
import { faker } from "@faker-js/faker";

const generateOrderData = () => {
  const services = [
    {
      name: "General Cleaning",
      rooms: faker.number.int({ min: 2, max: 5 }),
      price: faker.number.int({ min: 2000, max: 5000 }),
    },
    {
      name: "Deep Cleaning",
      rooms: faker.number.int({ min: 1, max: 3 }),
      price: faker.number.int({ min: 3000, max: 8000 }),
    },
    {
      name: "Window Cleaning",
      rooms: faker.number.int({ min: 2, max: 6 }),
      price: faker.number.int({ min: 1500, max: 3000 }),
    },
    {
      name: "Kitchen Cleaning",
      rooms: 1,
      price: faker.number.int({ min: 2500, max: 4000 }),
    },
  ];

  const customerName = faker.person.fullName();
  const customerEmail = faker.internet.email().toLowerCase();
  const customerAvatar = faker.image.avatarGitHub();
  const orderNumber = faker.number.int({ min: 1000, max: 9999 });
  const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

  const location = `No. ${faker.number.int({
    min: 1,
    max: 99,
  })} ${faker.location.street()}, ${faker.helpers.arrayElement([
    "Westlands",
    "Kilimani",
    "Karen",
    "Lavington",
    "Parklands",
    "Riverside",
  ])}, Nairobi`;

  const timeSlot = faker.helpers.arrayElement([
    "Today 2-4 PM",
    "Tomorrow 10-12 AM",
    "Tomorrow 2-4 PM",
    "Today 4-6 PM",
  ]);
  const minutesAgo = faker.number.int({ min: 1, max: 30 });

  return {
    orderNumber,
    customerName,
    customerEmail,
    customerAvatar,
    services,
    totalAmount,
    location,
    timeSlot,
    minutesAgo,
  };
};

type OrderStatus =
  | "new"
  | "ongoing"
  | "ready"
  | "delivered"
  | "cancelled"
  | "complete"
  | "rated";

interface HouseCleaningModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  openModal: (params: { orderId: string; orderStatus: OrderStatus }) => void;
  order: ReturnType<typeof generateOrderData>;
}

const HouseCleaningModalContext = createContext<
  HouseCleaningModalContextType | undefined
>(undefined);

export const HouseCleaningModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("new");
  const [orderData] = useState(generateOrderData());

  const openModal = ({
    orderId,
    orderStatus,
  }: {
    orderId: string;
    orderStatus: OrderStatus;
  }) => {
    setOrderId(orderId);
    setOrderStatus(orderStatus);
    setOpen(true);
  };

  return (
    <HouseCleaningModalContext.Provider
      value={{
        open,
        setOpen,
        orderId,
        setOrderId,
        orderStatus,
        setOrderStatus,
        openModal,
        order: orderData,
      }}
    >
      {children}
    </HouseCleaningModalContext.Provider>
  );
};

export const useHouseCleaningModal = () => {
  const context = useContext(HouseCleaningModalContext);
  if (!context) {
    throw new Error(
      "useHouseCleaningModal must be used within a HouseCleaningModalProvider"
    );
  }
  return context;
};
