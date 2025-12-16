import { createContext, useContext, useState, ReactNode } from "react";
import { IOrder } from "@/api/vendor/order/use_fetch_orders";

interface MovingModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder | null;
  openModal: (params: { order: IOrder }) => void;
  setOrder: (order: IOrder | null) => void;
}

const MovingModalContext = createContext<MovingModalContextType | undefined>(
  undefined
);

export const MovingModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);

  const openModal = ({ order }: { order: IOrder }) => {
    setOrder(order);
    setOpen(true);
  };

  return (
    <MovingModalContext.Provider
      value={{
        open,
        setOpen,
        order,
        setOrder,
        openModal,
      }}
    >
      {children}
    </MovingModalContext.Provider>
  );
};

export const useMovingModal = () => {
  const context = useContext(MovingModalContext);
  if (!context) {
    throw new Error("useMovingModal must be used within a MovingModalProvider");
  }
  return context;
};
