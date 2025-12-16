"use client";

import React, { createContext, useContext, useState } from "react";
import { IOrder } from "@/api/vendor/order/use_fetch_orders";

type FumigationModalContextType = {
  isOpen: boolean;
  openModal: (params: { order: IOrder }) => void;
  closeModal: () => void;
  order: IOrder | null;
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

export const FumigationModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);

  const openModal = ({ order }: { order: IOrder }) => {
    setOrder(order);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOrder(null);
  };

  return (
    <FumigationModalContext.Provider
      value={{ isOpen, openModal, closeModal, order }}
    >
      {children}
    </FumigationModalContext.Provider>
  );
};
