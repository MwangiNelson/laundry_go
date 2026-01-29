import { Customer_Page_UI } from "@/components/pageUIs/admin/customers/customer_page_ui";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="p-4">
      <Customer_Page_UI />
    </div>
  );
};

export default Page;
