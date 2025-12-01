import VendorForgotPasswordPageUI from "@/components/pageUIs/auth/vendor/forgot_password_page_ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - LaundryGo! Vendor",
  description:
    "Reset your vendor account password on LaundryGo!. Enter your email to receive a password reset link.",
  keywords: ["Vendor Forgot Password", "LaundryGo! Password Reset"],
};

export default function VendorForgotPasswordPage() {
  return <VendorForgotPasswordPageUI />;
}
