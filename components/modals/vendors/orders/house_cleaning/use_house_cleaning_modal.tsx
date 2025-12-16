import { createContext, useContext, useState, ReactNode } from "react";
import { IOrder } from "@/api/vendor/order/use_fetch_orders";

interface HouseCleaningModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder | null;
  openModal: (params: { order: IOrder }) => void;
  setOrder: (order: IOrder | null) => void;
}

const HouseCleaningModalContext = createContext<
  HouseCleaningModalContextType | undefined
>(undefined);

export const HouseCleaningModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);

  const openModal = ({ order }: { order: IOrder }) => {
    setOrder(order);
    setOpen(true);
  };

  return (
    <HouseCleaningModalContext.Provider
      value={{
        open,
        setOpen,
        order,
        setOrder,
        openModal,
      }}
    >
      {children}
    </HouseCleaningModalContext.Provider>
  );
};

export const useHouseCleaningModal = () => {
  const context = useContext(HouseCleaningModalContext);
  if (!context) {
    throw new Error(
      "useHouseCleaningModal must be used within a HouseCleaningModalProvider"
    );
  }
  return context;
};
