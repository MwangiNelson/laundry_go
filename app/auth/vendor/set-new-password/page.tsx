import VendorSetNewPasswordPageUI from "@/components/pageUIs/auth/vendor/set_new_password_page_ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password - LaundryGo! Vendor",
  description:
    "Create a new password for your LaundryGo! vendor account to regain access to your dashboard.",
  keywords: ["Vendor Set Password", "LaundryGo! New Password"],
};

export default function VendorSetNewPasswordPage() {
  return <VendorSetNewPasswordPageUI />;
}
