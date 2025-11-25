import { SigninPageUI } from "@/components/pageUIs/auth/signin_page_ui";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In to Laundry Go Mart",
  description: "Sign in to access the Laundry Go Mart admin dashboard",
};

const Page = () => {
  return <SigninPageUI />;
};

export default Page;
