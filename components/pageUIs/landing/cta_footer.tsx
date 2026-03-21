import { Button } from "@/components/ui/button";
import CTASectionBackground from "@/public/images/cta_bg.svg";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTAFooter() {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `url(${CTASectionBackground.src})`,
      }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl py-16 text-center lg:py-20">
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Ready to scale your business?
          </h2>
          <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
            Join LaundryGo and start turning local demand into faster growth for
            your team.
          </p>
          <Button
            asChild
            className="mt-8 h-12 rounded-full bg-landing-accent px-7 text-title hover:bg-landing-accent/90"
          >
            <Link href="/auth/vendor/signup">
              Register Your Business Today
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-white/70">
            No setup fees. No hidden costs. Pay only when you earn.
          </p>
        </div>
      </div>
    </section>
  );
}
