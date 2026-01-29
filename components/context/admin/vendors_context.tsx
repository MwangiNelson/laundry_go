"use client";

import {
  IVendorForModal,
  useFetchVendorById,
} from "@/api/admin/vendors/use_fetch_vendors";
import React, { createContext, useContext, useState, useCallback } from "react";

interface IVendorModalContext {
  isOpen: boolean;
  selectedVendorId: string | null;
  openModal: (vendorId: string) => void;
  closeModal: () => void;
  selectedVendor: IVendorForModal | undefined;
}

const VendorModalContext = createContext<IVendorModalContext | undefined>(
  undefined
);

export const VendorModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const { data: selectedVendor } = useFetchVendorById(selectedVendorId ?? "");

  const openModal = useCallback((vendorId: string) => {
    if (vendorId) {
      setSelectedVendorId(vendorId);
      setIsOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedVendorId(null);
  }, []);

  return (
    <VendorModalContext.Provider
      value={{
        isOpen,
        selectedVendorId,
        openModal,
        closeModal,
        selectedVendor,
      }}
    >
      {children}
    </VendorModalContext.Provider>
  );
};

export const useVendorModal = () => {
  const context = useContext(VendorModalContext);
  if (!context) {
    throw new Error("useVendorModal must be used within VendorModalProvider");
  }
  return context;
};
