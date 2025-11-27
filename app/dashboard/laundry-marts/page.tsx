import LaundryPageUI from "@/components/pageUIs/laundry_marts/laundry_marts_page_ui";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Laundry Marts - Dashboard",
  description: "Manage and monitor your laundry marts efficiently.",
};
const Page = () => {
  return <LaundryPageUI />;
};

export default Page;
