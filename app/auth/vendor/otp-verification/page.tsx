import VendorOtpVerificationPageUI from "@/components/pageUIs/auth/vendor/otp_verification_page_ui";
import { SignUpOTP } from "@/components/pageUIs/auth/vendor/signup_otp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification - LaundryGo! Vendor",
  description:
    "Verify your identity with the OTP sent to your email to complete the password reset process.",
  keywords: ["Vendor OTP Verification", "LaundryGo! Verification"],
};

export default function VendorOtpVerificationPage() {
  return <SignUpOTP />;
}
