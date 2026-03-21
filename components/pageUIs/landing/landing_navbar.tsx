import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function LandingNavbar() {
  return (
    <header className="bg-landing-primary">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/logos/main.svg"
            alt="LaundryGo!"
            width={202}
            height={47}
            className="h-auto w-[156px] sm:w-[182px]"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/auth/vendor/signin"
            className="text-sm font-medium text-white/90 transition hover:text-white"
          >
            Already a partner? Sign in
          </Link>
          <Button
            asChild
            className="h-11 rounded-full bg-landing-accent px-6 text-title hover:bg-landing-accent/90"
          >
            <Link href="/auth/vendor/signup">Register Now</Link>
          </Button>
        </div>

        <Button
          asChild
          className="h-10 rounded-full bg-landing-accent px-5 text-title hover:bg-landing-accent/90 md:hidden"
        >
          <Link href="/auth/vendor/signup">Join</Link>
        </Button>
      </div>
    </header>
  );
}
