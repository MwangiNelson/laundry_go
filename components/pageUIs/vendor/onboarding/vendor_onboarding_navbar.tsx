import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const VendorOnboardingNavbar = ({
  showDashboardLink,
}: {
  showDashboardLink: boolean;
}) => {
  return (
    <header className="border-b border-border bg-landing-primary">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/logos/main.svg"
            alt="LaundryGo!"
            width={202}
            height={47}
            className="h-auto w-[140px]"
            priority
          />
        </Link>

        {showDashboardLink && (
          <Link
            href="/vendor"
            className="text-sm bg-primary px-4 py-2 flex flex-row items-center justify-center rounded-lg font-medium text-muted-foreground transition hover:text-title"
          >
            Back to dashboard
            <ArrowRight className="size-4 ml-1" />
          </Link>
        )}
      </div>
    </header>
  );
};
