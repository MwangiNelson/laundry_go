import React from "react";
import { Metadata } from "next";
import { FumigationOrdersPageUI } from "@/components/pageUIs/vendor/orders/fumigation_orders_page_ui";

export const metadata: Metadata = {
  title: "Fumigation Orders - LaundryGo! Vendor",
  description: "View and manage all your fumigation orders efficiently.",
  keywords: ["Fumigation Orders", "LaundryGo!"],
};

const Page = () => {
  return <FumigationOrdersPageUI />;
};

export default Page;
