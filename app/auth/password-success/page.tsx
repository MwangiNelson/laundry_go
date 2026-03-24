import { Suspense } from "react";
import { PasswordSuccessPageUI } from "@/components/pageUIs/auth/admin/password_success_page_ui";

export default function PasswordSuccessPage() {
  return (
    <Suspense>
      <PasswordSuccessPageUI />
    </Suspense>
  );
}
