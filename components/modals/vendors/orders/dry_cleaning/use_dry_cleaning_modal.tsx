import { createContext, useContext, useState, ReactNode } from "react";
import { IOrder } from "@/api/vendor/order/use_fetch_orders";

interface DryCleaningModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder;
  openModal: (params: { order: IOrder }) => void;
  setOrder: (order: IOrder | null) => void;
}

const DryCleaningModalContext = createContext<
  DryCleaningModalContextType | undefined
>(undefined);

export const DryCleaningModalProvider = ({
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
    <DryCleaningModalContext.Provider
      value={{
        open,
        setOpen,
        order: order!,
        setOrder,

        openModal,
      }}
    >
      {children}
    </DryCleaningModalContext.Provider>
  );
};

export const useDryCleaningModal = () => {
  const context = useContext(DryCleaningModalContext);
  if (!context) {
    throw new Error(
      "useDryCleaningModal must be used within DryCleaningModalProvider"
    );
  }
  return context;
};
