import React from "react";
import { Metadata } from "next";
import { MovingOrdersPageUI } from "@/components/pageUIs/vendor/orders/moving_orders_page_ui";

export const metadata: Metadata = {
  title: "Moving Orders - LaundryGo! Vendor",
  description: "View and manage all your moving orders efficiently.",
  keywords: ["Moving Orders", "LaundryGo!"],
};

const Page = () => {
  return <MovingOrdersPageUI />;
};

export default Page;
