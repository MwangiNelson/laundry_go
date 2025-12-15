import React from "react";
import { Metadata } from "next";
import { OfficeCleaningOrdersPageUI } from "@/components/pageUIs/vendor/orders/office_cleaning_orders_page_ui";

export const metadata: Metadata = {
  title: "Office Cleaning Orders - LaundryGo! Vendor",
  description: "View and manage all your office cleaning orders efficiently.",
  keywords: ["Office Cleaning Orders", "LaundryGo!"],
};

const Page = () => {
  return <OfficeCleaningOrdersPageUI />;
};

export default Page;
