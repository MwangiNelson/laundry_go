"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ICustomerModalContext {
  isOpen: boolean;
  selectedCustomerId: string | null;
  openModal: (customerId: string) => void;
  closeModal: () => void;
}

const CustomerModalContext = createContext<ICustomerModalContext | undefined>(
  undefined
);

export const CustomerModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  const openModal = useCallback((customerId: string) => {
    if (customerId) {
      setSelectedCustomerId(customerId);
      setIsOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedCustomerId(null);
  }, []);

  return (
    <CustomerModalContext.Provider
      value={{
        isOpen,
        selectedCustomerId,
        openModal,
        closeModal,
      }}
    >
      {children}
    </CustomerModalContext.Provider>
  );
};

export const useCustomerModal = () => {
  const context = useContext(CustomerModalContext);
  if (!context) {
    throw new Error(
      "useCustomerModal must be used within CustomerModalProvider"
    );
  }
  return context;
};
