import { createContext, useContext, useState, ReactNode } from "react";
import { IOrder } from "@/api/vendor/order/use_fetch_orders";

interface OfficeCleaningModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder | null;
  openModal: (params: { order: IOrder }) => void;
  setOrder: (order: IOrder | null) => void;
}

const OfficeCleaningModalContext = createContext<
  OfficeCleaningModalContextType | undefined
>(undefined);

export const OfficeCleaningModalProvider = ({
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
    <OfficeCleaningModalContext.Provider
      value={{
        open,
        setOpen,
        order,
        setOrder,
        openModal,
      }}
    >
      {children}
    </OfficeCleaningModalContext.Provider>
  );
};

export const useOfficeCleaningModal = () => {
  const context = useContext(OfficeCleaningModalContext);
  if (!context) {
    throw new Error(
      "useOfficeCleaningModal must be used within an OfficeCleaningModalProvider"
    );
  }
  return context;
};
