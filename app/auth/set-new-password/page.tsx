import { Suspense } from "react";
import { SetNewPasswordPageUI } from "@/components/pageUIs/auth/admin/set_new_password_page_ui";

export default function SetNewPasswordPage() {
  return (
    <Suspense>
      <SetNewPasswordPageUI />
    </Suspense>
  );
}
