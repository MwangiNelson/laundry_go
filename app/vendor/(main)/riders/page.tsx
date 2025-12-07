import React from "react";
import { Metadata } from "next";
import { RidersPageUI } from "@/components/pageUIs/vendor/riders/riders_page_ui";

export const metadata: Metadata = {
  title: "Riders - LaundryGo! Vendor",
  description: "Manage your riders and their deliveries efficiently.",
  keywords: ["Riders", "LaundryGo! Rider"],
};

const Page = () => {
  return <RidersPageUI />;
};

export default Page;
