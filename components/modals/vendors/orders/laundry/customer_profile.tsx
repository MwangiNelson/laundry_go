import { CustomerProfile as SharedCustomerProfile } from "../shared/customer_profile";
import { useLaundryModal } from "./use_laundry_modal";

export const CustomerProfile = () => {
  const { order } = useLaundryModal();
  return (
    <SharedCustomerProfile
      name={order?.customer.full_name || "N/A"}
      email={order?.customer.email || "N/A"}
      avatar={order?.customer.avatar_url || ""}
    />
  );
};
