"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { CustomerModalProvider } from "./customers_modal_provider";
import { CustomerModal } from "../modals/admin/customers/customers.modal";
import { VendorModalProvider } from "./admin/vendors_context";
import { VendorDetailsModal } from "../modals/admin/vendor_details/vendor_details_main.modal";

type DashboardUIContextType = {
  sidebar: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  };
  notificationDrawer: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  };
};

const DashboardUIContext = createContext<DashboardUIContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

export const DashboardUIProvider = ({ children }: Props) => {
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <DashboardUIContext.Provider
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
      <CustomerModalProvider>
        <VendorModalProvider>
          <Modals>{children}</Modals>
        </VendorModalProvider>
      </CustomerModalProvider>
    </DashboardUIContext.Provider>
  );
};

export function useDashboardUI() {
  const context = useContext(DashboardUIContext);
  if (context === undefined) {
    throw new Error("useDashboardUI must be used within a DashboardUIProvider");
  }
  return context;
}

const Modals = ({ children }: { children: React.ReactNode }) => (
  <>
    <CustomerModal />
    <VendorDetailsModal />
    {children}
  </>
);
