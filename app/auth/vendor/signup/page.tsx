import SignUpPageUI from "@/components/pageUIs/auth/vendor/signup_page_ui";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vendor Sign Up - LaundryGo!",
  description:
    "Create your vendor account on LaundryGo! and start managing your laundry, home cleaning, moving services, and more.",
  keywords: ["Vendor Sign Up", "LaundryGo! Vendor Registration"],
};

const Page = () => {
  return <SignUpPageUI />;
};

export default Page;
