"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InfiniteCarousel } from "@/components/ui/infinite_carousel";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CircleDollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    icon: BellRing,
    copy: "Instant order notifications",
  },
  {
    icon: BadgeCheck,
    copy: "Guaranteed payouts",
  },
  {
    icon: CircleDollarSign,
    copy: "Free marketing and full control of pricing",
  },
];

const services = [
  {
    title: "Laundry Services",
    image: "/images/laundry_service.svg",
  },
  {
    title: "Carpet Cleaning",
    image: "/images/carpet_cleaning_service.svg",
  },
  {
    title: "Moving",
    image: "/images/moving_service.svg",
  },
  {
    title: "Fumigation",
    image: "/images/fumigator_service.svg",
  },
  {
    title: "House Cleaning",
    image: "/images/house_cleaning_service.svg",
  },
];

const partners = ["RA", "KN", "FM"];

export function Hero() {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    services[0].title,
  ]);

  const toggleService = (serviceTitle: string) => {
    setSelectedServices((current) =>
      current.includes(serviceTitle)
        ? current.filter((service) => service !== serviceTitle)
        : [...current, serviceTitle]
    );
  };

  return (
    <section
      id="hero"
      className="overflow-hidden "
    >
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-20">
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-title sm:text-5xl lg:text-6xl">
              Grow your laundry business with LaundryGo!
            </h1>
            <p className="max-w-lg text-base leading-8 text-subtitle sm:text-lg">
              Join hundreds of vendors and start receiving local orders in under
              3 minutes.
            </p>
          </div>

          <div className="space-y-4">
            {highlights.map(({ icon: Icon, copy }) => (
              <div key={copy} className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-landing-primary-faint text-landing-primary">
                  <Icon className="size-5" />
                </div>
                <p className="pt-2 text-sm font-medium leading-6 text-title sm:text-base">
                  {copy}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 py-3 sm:w-fit">
            <div className="flex -space-x-3">
              {partners.map((partner) => (
                <Avatar
                  key={partner}
                  className="size-10 border-2 border-white bg-landing-primary-light"
                >
                  <AvatarFallback className="bg-landing-primary-light text-xs font-bold text-landing-primary">
                    {partner}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-title">
                500+ laundries onboarded across Nairobi
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-[32px] border-white/80 bg-white/95 px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-[-0.03em] text-title">
                Become a Partner
              </p>
              <p className="text-sm leading-6 text-subtitle">
                Set up your storefront, choose your services, and get your first
                orders in minutes.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-subtitle">
                  Business name
                </label>
                <Input
                  placeholder="Sparkle Cleaners"
                  className="h-12 rounded-full border-border/70 bg-white px-4 shadow-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-subtitle">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="johndoe@laundrygo.com"
                  className="h-12 rounded-full border-border/70 bg-white px-4 shadow-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-subtitle">
                Location
              </label>
              <Input
                placeholder="Westlands, Nairobi"
                className="h-12 rounded-full border-border/70 bg-white px-4 shadow-none"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtitle">
                Services Offered
              </p>

              <InfiniteCarousel
                trackClassName="-ml-3"
                slideClassName="basis-[68%] pl-3 sm:basis-[42%] lg:basis-[33%]"
                controlsClassName="justify-start"
                showControls={false}
              >
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service.title);

                  return (
                    <Card
                      key={service.title}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleService(service.title)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleService(service.title);
                        }
                      }}
                      className={cn(
                        "relative min-h-[100px] min-w-12 cursor-pointer rounded-[24px] border px-4 py-4 shadow-none transition",
                        isSelected
                          ? "border-landing-accent bg-landing-accent/5"
                          : "border-border/70 bg-white hover:border-landing-accent/60 hover:bg-landing-accent/5"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        aria-hidden="true"
                        tabIndex={-1}
                        className="pointer-events-none absolute top-3 right-3 size-5 rounded-md border-slate-300 bg-white text-landing-accent shadow-none data-[state=checked]:border-landing-accent data-[state=checked]:bg-landing-accent/5 data-[state=checked]:text-landing-accent"
                      />
                      <div className="flex flex-1 items-center justify-center">
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={56}
                          height={56}
                          className="h-12 w-auto"
                        />
                      </div>
                      <span className="text-center text-xs font-semibold leading-5 text-title">
                        {service.title}
                      </span>
                    </Card>
                  );
                })}
              </InfiniteCarousel>
            </div>

            <Button
              asChild
              className="h-12 w-full rounded-full bg-landing-accent text-title hover:bg-landing-accent/90"
            >
              <Link
                href="/auth/vendor/signup"
                className="flex flex-row items-center gap-2 font-bold"
              >
                Join LaundryGo!
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <p className="text-center text-sm text-subtitle">
              By joining, you agree to LaundryGo&apos;s Partner{" "}
              <Link href="#faqs" className="text-landing-primary underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#faqs" className="text-landing-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
