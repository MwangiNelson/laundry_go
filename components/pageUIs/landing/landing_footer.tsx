import { Separator } from "@/components/ui/separator";
import AppleLogo from "@/public/logos/apple_logo.svg";
import GooglePlayLogo from "@/public/logos/google_play_logo.svg";
import Image from "next/image";
import Link from "next/link";

const partnerLinks = [
  {
    label: "Partner Dashboard",
    href: "#how-it-works",
  },
  {
    label: "Success Guide",
    href: "#features",
  },
  {
    label: "Pricing Structure",
    href: "#preview",
  },
  {
    label: "Support Center",
    href: "#faqs",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "#faqs",
  },
  {
    label: "Terms of Service",
    href: "#faqs",
  },
  {
    label: "Cookie Policy",
    href: "#faqs",
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-landing-primary text-white">
      <div className="mx-auto w-full max-w-[1180px] border-t border-white/15 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:py-12">
          <div className="space-y-4">
            <Image
              src="/logos/main.svg"
              alt="LaundryGo!"
              width={202}
              height={47}
              className="h-auto w-[170px]"
            />
            <p className="max-w-sm text-sm leading-7 text-white/75">
              The #1 marketplace for local laundry services. Empowering small
              businesses across the continent.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Partner Resources
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {partnerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white transition hover:text-white/75"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white transition hover:text-white/75"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Get the customer&apos;s app
            </p>
            <div className="flex flex-row flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <Image
                  src={AppleLogo}
                  alt="LaundryGo App Logo"
                  width={30}
                  height={30}
                  className="h-auto w-[30px] object-contain"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Download on the
                  </p>
                  <p className="font-semibold text-white">App Store</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <Image
                  src={GooglePlayLogo}
                  alt="Google Play Store Logo"
                  width={30}
                  height={30}
                  className="h-auto w-[30px] object-contain"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Get it on
                  </p>
                  <p className="font-light text-white">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/15" />

        <div className="flex flex-col gap-3 py-5 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} LaundryGo. Built for service partners.
          </p>
          <p>Vendor operations, reporting, and messaging in one place.</p>
        </div>
      </div>
    </footer>
  );
}
