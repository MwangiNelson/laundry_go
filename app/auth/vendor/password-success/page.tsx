import VendorPasswordSuccessPageUI from "@/components/pageUIs/auth/vendor/password_success_page_ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Changed - LaundryGo! Vendor",
  description:
    "Your password has been successfully changed. Sign in to your LaundryGo! vendor account with your new password.",
  keywords: ["Vendor Password Success", "LaundryGo! Password Changed"],
};

export default function VendorPasswordSuccessPage() {
  return <VendorPasswordSuccessPageUI />;
}
