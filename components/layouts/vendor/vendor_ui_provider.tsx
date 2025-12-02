"use client";
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
      <Modals>{children}</Modals>
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

const Modals = ({ children }: { children: React.ReactNode }) => <>{children}</>;
