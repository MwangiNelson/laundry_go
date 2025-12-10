"use client";

import { faker } from "@faker-js/faker";
import React, { createContext, useContext, useState } from "react";

type OrderStatus = "new" | "ongoing";

type Room = {
  name: string;
  quantity: number;
};

type FumigationOrderData = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  rooms: Room[];
  serviceType: string;
  location: string;
  serviceTime: string;
  totalAmount: number;
  timeAgo: string;
};

type FumigationModalContextType = {
  isOpen: boolean;
  openModal: (order: FumigationOrderData, status: OrderStatus) => void;
  closeModal: () => void;
  order: FumigationOrderData | null;
  orderStatus: OrderStatus;
};

const FumigationModalContext = createContext<
  FumigationModalContextType | undefined
>(undefined);

export const useFumigationModal = () => {
  const context = useContext(FumigationModalContext);
  if (!context) {
    throw new Error(
      "useFumigationModal must be used within FumigationModalProvider"
    );
  }
  return context;
};

const generateMockFumigationOrder = (): FumigationOrderData => {
  faker.seed(Date.now());

  const rooms: Room[] = [
    { name: "Single Office", quantity: faker.number.int({ min: 1, max: 5 }) },
    { name: "Kitchen", quantity: faker.number.int({ min: 1, max: 5 }) },
    { name: "Gym", quantity: faker.number.int({ min: 1, max: 5 }) },
    { name: "Restrooms", quantity: faker.number.int({ min: 1, max: 5 }) },
  ];

  const serviceTypes = [
    "Cockroach Infestation",
    "Bed Bug Treatment",
    "Termite Control",
    "Rodent Control",
    "General Pest Control",
  ];

  const totalAmount = faker.number.int({ min: 50000, max: 150000 });

  return {
    orderId: `#${faker.number.int({ min: 1000, max: 9999 })}`,
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    customerAvatar: faker.image.avatar(),
    rooms,
    serviceType: faker.helpers.arrayElement(serviceTypes),
    location: `${faker.location.buildingNumber()} ${faker.location.street()}, ${faker.location.city()}, Nairobi`,
    serviceTime: `Today ${faker.number.int({
      min: 8,
      max: 16,
    })}-${faker.number.int({ min: 17, max: 20 })} PM`,
    totalAmount,
    timeAgo: `${faker.number.int({ min: 1, max: 60 })} mins`,
  };
};

export const FumigationModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<FumigationOrderData | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("new");

  const openModal = (order: FumigationOrderData, status: OrderStatus) => {
    setOrder(order);
    setOrderStatus(status);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOrder(null);
  };

  return (
    <FumigationModalContext.Provider
      value={{ isOpen, openModal, closeModal, order, orderStatus }}
    >
      {children}
    </FumigationModalContext.Provider>
  );
};

export { generateMockFumigationOrder };
export type { FumigationOrderData, OrderStatus };
