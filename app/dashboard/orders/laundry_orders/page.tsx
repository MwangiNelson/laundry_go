import React from "react";
import { Metadata } from "next";
import { LaundryOrdersPageUI } from "@/components/pageUIs/vendor/orders/laundry_orders_page_ui";

export const metadata: Metadata = {
  title: "Laundry Orders - LaundryGo! Vendor",
  description: "View and manage all your laundry orders efficiently.",
  keywords: ["Laundry Orders", "LaundryGo!"],
};

const Page = () => {
  return <LaundryOrdersPageUI />;
};

export default Page;
