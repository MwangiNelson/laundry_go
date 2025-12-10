import { createContext, useContext, useState, ReactNode } from "react";
import { faker } from "@faker-js/faker";

const generateOrderData = () => {
  const rooms = [
    {
      name: "Bedrooms",
      quantity: faker.number.int({ min: 1, max: 5 }),
    },
    {
      name: "Toilets",
      quantity: faker.number.int({ min: 1, max: 4 }),
    },
    {
      name: "Living room",
      quantity: 1,
    },
    {
      name: "Bathrooms",
      quantity: faker.number.int({ min: 1, max: 3 }),
    },
  ];

  const customerName = faker.person.fullName();
  const customerEmail = faker.internet.email().toLowerCase();
  const customerAvatar = faker.image.avatarGitHub();
  const orderNumber = faker.number.int({ min: 1000, max: 9999 });
  const totalAmount = faker.number.int({ min: 50000, max: 150000 });

  const pickupFloor = faker.number.int({ min: 1, max: 10 });
  const destinationFloor = faker.number.int({ min: 1, max: 10 });

  const pickupLocation = `No. ${faker.number.int({
    min: 1,
    max: 99,
  })} ${faker.location.street()}, ${faker.helpers.arrayElement([
    "Loresho",
    "Westlands",
    "Kilimani",
    "Karen",
    "Lavington",
  ])}, Nairobi`;

  const destinationLocation = `Block ${faker.helpers.arrayElement([
    "A",
    "B",
    "C",
    "D",
  ])}, ${faker.helpers.arrayElement([
    "Riverside Residency",
    "Garden Estate",
    "Parklands Towers",
    "Kilimani Heights",
  ])}, ${faker.helpers.arrayElement([
    "Riverside",
    "Westlands",
    "Parklands",
    "Kilimani",
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
    rooms,
    totalAmount,
    pickupLocation,
    destinationLocation,
    pickupFloor,
    destinationFloor,
    timeSlot,
    minutesAgo,
  };
};

type OrderStatus = "new" | "ongoing" | "ready" | "delivered" | "cancelled";

interface MovingModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  openModal: (params: { orderId: string; orderStatus: OrderStatus }) => void;
  order: ReturnType<typeof generateOrderData>;
}

const MovingModalContext = createContext<MovingModalContextType | undefined>(
  undefined
);

export const MovingModalProvider = ({ children }: { children: ReactNode }) => {
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
    <MovingModalContext.Provider
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
    </MovingModalContext.Provider>
  );
};

export const useMovingModal = () => {
  const context = useContext(MovingModalContext);
  if (!context) {
    throw new Error("useMovingModal must be used within a MovingModalProvider");
  }
  return context;
};
