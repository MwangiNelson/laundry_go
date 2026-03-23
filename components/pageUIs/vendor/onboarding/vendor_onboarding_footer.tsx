import Link from "next/link";

export const VendorOnboardingFooter = () => {
  return (
    <footer className="border-t border-white/60 bg-white/80">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Complete your business profile once, then update it anytime from your dashboard.</p>
        <div className="flex items-center gap-5">
          <Link
            href="mailto:support@laundrygo.app"
            className="transition hover:text-title"
          >
            support@laundrygo.app
          </Link>
          <Link href="/" className="transition hover:text-title">
            LaundryGo
          </Link>
        </div>
      </div>
    </footer>
  );
};
