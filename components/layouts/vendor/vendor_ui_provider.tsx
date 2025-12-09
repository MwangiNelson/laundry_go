"use client";
import { NewLaundryOrderModal } from "@/components/modals/vendors/orders/laundry/laundry_order_main.modal";
import { LaundryModalProvider } from "@/components/modals/vendors/orders/laundry/use_laundry_modal";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type VendorUIContextType = {
  sidebar: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  };
  notificationDrawer: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  };
};

const VendorUIContext = createContext<VendorUIContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const VendorUIProvider = ({ children }: Props) => {
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <VendorUIContext.Provider
      value={{
        sidebar: {
          isOpen: isSidebarOpen,
          setIsOpen: setIsSidebarOpen,
        },
        notificationDrawer: {
          isOpen: isNotificationDrawerOpen,
          setIsOpen: setIsNotificationDrawerOpen,
        },
      }}
    >
      <LaundryModalProvider>
        <Modals>{children}</Modals>
      </LaundryModalProvider>
    </VendorUIContext.Provider>
  );
};

export function useVendorUI() {
  const context = useContext(VendorUIContext);
  if (context === undefined) {
    throw new Error("useVendorUI must be used within a VendorUIProvider");
  }
  return context;
}

const Modals = ({ children }: { children: React.ReactNode }) => (
  <>
    <NewLaundryOrderModal />
    {children}
  </>
);
