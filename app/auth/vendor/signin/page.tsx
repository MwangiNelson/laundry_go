import SignInPageUI from "@/components/pageUIs/auth/vendor/signin_page_ui";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vendor Sign In - LaundryGo!",
  description:
    "Sign in to your vendor account on LaundryGo! and manage your services, orders, and commissions with ease.",
  keywords: ["Vendor Sign In", "LaundryGo! Vendor Login"],
};
const Page = () => {
  return <SignInPageUI />;
};

export default Page;
