import { PasswordSuccessPageUI } from "@/components/pageUIs/auth/admin/password_success_page_ui";

export default async function PasswordSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <PasswordSuccessPageUI next={next} />;
}
