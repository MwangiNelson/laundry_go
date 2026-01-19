import { ReportsPageUI } from "@/components/pageUIs/reports/reports_page_ui";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Reports - Vendor Dashboard",
  description: "View and manage your reports in the vendor dashboard.",
};
const Page = () => {
  return <ReportsPageUI />;
};

export default Page;
