import React from "react";
import { Metadata } from "next";
import { HouseCleaningOrdersPageUI } from "@/components/pageUIs/vendor/orders/house_cleaning_orders_page_ui";

export const metadata: Metadata = {
  title: "House Cleaning Orders - LaundryGo! Vendor",
  description: "View and manage all your house cleaning orders efficiently.",
  keywords: ["House Cleaning Orders", "LaundryGo!"],
};

const Page = () => {
  return <HouseCleaningOrdersPageUI />;
};

export default Page;
