"use client";

import { VendorBranchesPageUI } from "@/components/pageUIs/vendor/branches/vendor_branches_page_ui";
import { Protect } from "@/components/context/vendors/vendor_gate";
import { redirect } from "next/navigation";

const BranchesPage = () => {
  return (
    <Protect
      condition={(p) => p.canManageBranches}
      fallback={<BranchAccessDenied />}
    >
      <VendorBranchesPageUI />
    </Protect>
  );
};

const BranchAccessDenied = () => {
  redirect("/vendor");
};

export default BranchesPage;
