import { Card } from "@/components/ui/card";
import { FileCheck2, Rocket, ShieldCheck } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Register",
    description:
      "Fill in the onboarding form with your business details and service area.",
    icon: FileCheck2,
  },
  {
    number: "02",
    title: "Get Approved",
    description:
      "Our team reviews your application and verifies your facility within 24 hours.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Start Receiving Orders",
    description:
      "Go online and start accepting orders from customers in your vicinity.",
    icon: Rocket,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[210px_1fr_210px] lg:items-end">
          <div className="hidden lg:flex lg:justify-start">
            <Image
              src="/images/how_it_works_1.png"
              alt="LaundryGo partner using a phone"
              width={180}
              height={140}
              className="h-auto w-[180px]"
            />
          </div>

          <div className="mx-auto max-w-2xl text-center">

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-title sm:text-4xl">
              How it works

            </h2>
            <p className="mt-4 text-base leading-8 text-subtitle">
              Three simple steps to launch your digital storefront.
            </p>

            <div className="mt-8 flex items-end justify-center gap-4 lg:hidden">
              <Image
                src="/images/how_it_works_1.png"
                alt="LaundryGo partner using a phone"
                width={132}
                height={104}
                className="h-auto w-[132px] absolute"
              />
              <Image
                src="/images/how_it_works_2.svg"
                alt="LaundryGo delivery team"
                width={148}
                height={104}
                className="h-auto w-[148px] relative"
              />
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <Image
              src="/images/how_it_works_2.svg"
              alt="LaundryGo delivery team"
              width={190}
              height={130}
              className="h-auto w-[190px]"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <Card
              key={number}
              className="relative rounded-[28px] border-landing-primary/35 bg-landing-primary-faint px-6 py-6 shadow-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-full bg-white text-landing-primary shadow-sm">
                  <Icon className="size-5" />
                </div>
                <span className="text-4xl font-bold tracking-[-0.06em] text-landing-primary/30">
                  {number}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-[-0.03em] text-title">
                  {title}
                </h3>
                <p className="text-sm leading-7 text-subtitle sm:text-base">
                  {description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
