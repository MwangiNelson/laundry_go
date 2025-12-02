import DashboardPageUI from "@/components/pageUIs/admin/dashboard/dashboard_page_ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of key metrics and statistics",
};

const Page = () => {
  return <DashboardPageUI />;
};

export default Page;
