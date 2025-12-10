"use client";
import { NewLaundryOrderModal } from "@/components/modals/vendors/orders/laundry/laundry_order_main.modal";
import { LaundryModalProvider } from "@/components/modals/vendors/orders/laundry/use_laundry_modal";
import { MovingOrderMainModal } from "@/components/modals/vendors/orders/moving/moving_order_main.modal";
import { MovingModalProvider } from "@/components/modals/vendors/orders/moving/use_moving_modal";
import { HouseCleaningOrderMainModal } from "@/components/modals/vendors/orders/house_cleaning/house_cleaning_order_main.modal";
import { HouseCleaningModalProvider } from "@/components/modals/vendors/orders/house_cleaning/use_house_cleaning_modal";
import { OfficeCleaningOrderMainModal } from "@/components/modals/vendors/orders/office_cleaning/office_cleaning_order_main.modal";
import { OfficeCleaningModalProvider } from "@/components/modals/vendors/orders/office_cleaning/use_office_cleaning_modal";
import { FumigationOrderMainModal } from "@/components/modals/vendors/orders/fumigation/fumigation_order_main.modal";
import { FumigationModalProvider } from "@/components/modals/vendors/orders/fumigation/use_fumigation_modal";
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
        <MovingModalProvider>
          <HouseCleaningModalProvider>
            <OfficeCleaningModalProvider>
              <FumigationModalProvider>
                <Modals>{children}</Modals>
              </FumigationModalProvider>
            </OfficeCleaningModalProvider>
          </HouseCleaningModalProvider>
        </MovingModalProvider>
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
    <MovingOrderMainModal />
    <HouseCleaningOrderMainModal />
    <OfficeCleaningOrderMainModal />
    <FumigationOrderMainModal />
    {children}
  </>
);
