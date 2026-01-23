
import { AdminReportsPageUI } from "@/components/pageUIs/admin/reports/reports_page_admin_ui";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Reports - Vendor Dashboard",
  description: "View and manage your reports in the vendor dashboard.",
};
const Page = () => {
  return(
    <AdminReportsPageUI/>
  )
};

export default Page;
