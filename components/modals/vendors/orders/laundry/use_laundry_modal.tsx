import { createContext, useContext, useState, ReactNode } from "react";

type OrderStatus = "new" | "ongoing" | "ready" | "delivered" | "cancelled";

interface LaundryModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  openModal: (params: { orderId: string; orderStatus: OrderStatus }) => void;
}

const LaundryModalContext = createContext<LaundryModalContextType | undefined>(
  undefined
);

export const LaundryModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("new");
  const openModal = ({
    orderId,
    orderStatus,
  }: {
    orderId: string;
    orderStatus: OrderStatus;
  }) => {
    setOrderId(orderId);
    setOrderStatus(orderStatus);
    setOpen(true);
  };

  return (
    <LaundryModalContext.Provider
      value={{
        open,
        setOpen,
        orderId,
        setOrderId,
        orderStatus,
        setOrderStatus,
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
