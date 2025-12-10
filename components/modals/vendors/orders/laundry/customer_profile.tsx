import { CustomerProfile as SharedCustomerProfile } from "../shared/customer_profile";
import { useLaundryModal } from "./use_laundry_modal";

export const CustomerProfile = () => {
  const { order } = useLaundryModal();
  return (
    <SharedCustomerProfile
      name={order.customerName}
      email={order.customerEmail}
      avatar={order.customerAvatar}
    />
  );
};
