import { createContext, useContext, useState, ReactNode } from "react";
import { faker } from "@faker-js/faker";

const generateOrderData = () => {
  const rooms = [
    {
      name: "Single Office",
      quantity: faker.number.int({ min: 2, max: 8 }),
    },
    {
      name: "Kitchen",
      quantity: faker.number.int({ min: 1, max: 3 }),
    },
    {
      name: "Gym",
      quantity: faker.number.int({ min: 1, max: 2 }),
    },
    {
      name: "Restrooms",
      quantity: faker.number.int({ min: 2, max: 6 }),
    },
  ];

  const customerName = faker.person.fullName();
  const customerEmail = faker.internet.email().toLowerCase();
  const customerAvatar = faker.image.avatarGitHub();
  const orderNumber = faker.number.int({ min: 1000, max: 9999 });
  const totalAmount = faker.number.int({ min: 60000, max: 120000 });

  const location = `No. ${faker.number.int({
    min: 1,
    max: 99,
  })} ${faker.location.street()}, ${faker.helpers.arrayElement([
    "Westlands",
    "Upper Hill",
    "CBD",
    "Kilimani",
    "Parklands",
  ])}, Nairobi`;

  const serviceType = faker.helpers.arrayElement([
    "Regular Cleaning",
    "Deep Cleaning",
    "Post-Construction Cleaning",
  ]);

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
    location,
    serviceType,
    timeSlot,
    minutesAgo,
  };
};

type OrderStatus = "new" | "ongoing" | "ready" | "delivered" | "cancelled";

interface OfficeCleaningModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  openModal: (params: { orderId: string; orderStatus: OrderStatus }) => void;
  order: ReturnType<typeof generateOrderData>;
}

const OfficeCleaningModalContext = createContext<
  OfficeCleaningModalContextType | undefined
>(undefined);

export const OfficeCleaningModalProvider = ({
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
    <OfficeCleaningModalContext.Provider
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
    </OfficeCleaningModalContext.Provider>
  );
};

export const useOfficeCleaningModal = () => {
  const context = useContext(OfficeCleaningModalContext);
  if (!context) {
    throw new Error(
      "useOfficeCleaningModal must be used within an OfficeCleaningModalProvider"
    );
  }
  return context;
};
