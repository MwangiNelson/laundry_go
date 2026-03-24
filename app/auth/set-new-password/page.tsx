import { SetNewPasswordPageUI } from "@/components/pageUIs/auth/admin/set_new_password_page_ui";

export default async function SetNewPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <SetNewPasswordPageUI next={next} />;
}
