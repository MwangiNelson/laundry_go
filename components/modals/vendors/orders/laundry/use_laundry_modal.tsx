import { createContext, useContext, useState, ReactNode } from "react";
import { IOrder } from "@/api/vendor/order/use_fetch_orders";

interface LaundryModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder;
  openModal: (params: { order: IOrder }) => void;
  setOrder: (order: IOrder | null) => void;
}

const LaundryModalContext = createContext<LaundryModalContextType | undefined>(
  undefined
);

export const LaundryModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);
  const openModal = ({ order }: { order: IOrder }) => {
    setOrder(order);
    setOpen(true);
  };

  return (
    <LaundryModalContext.Provider
      value={{
        open,
        setOpen,
        order: order!,
        setOrder,

        openModal,
      }}
    >
      {children}
    </LaundryModalContext.Provider>
  );
};

export const useLaundryModal = () => {
  const context = useContext(LaundryModalContext);
  if (!context) {
    throw new Error("useLaundryModal must be used within LaundryModalProvider");
  }
  return context;
};
