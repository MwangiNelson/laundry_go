import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  BadgeDollarSign,
  CheckCircle2,
  ClipboardList,
  Headphones,
  MapPinned,
  MessageSquareMore,
} from "lucide-react";

const featureCards = [
  {
    title: "Order Management",
    description:
      "Track all ongoing and past orders in one clean view.",
    icon: ClipboardList,
  },
  {
    title: "Location Matching",
    description:
      "Get paired with customers in your neighborhood and other branch locations.",
    icon: MapPinned,
  },
  {
    title: "Messaging",
    description:
      "Chat directly with customers for specific order instructions.",
    icon: MessageSquareMore,
  },
  {
    title: "Set Prices",
    description:
      "You have full control over your pricing, service list and subscription plans.",
    icon: BadgeDollarSign,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:px-8">
        <div className="max-w-xl space-y-6">

          <h2 className="text-3xl font-bold tracking-[-0.04em] text-title sm:text-4xl lg:text-5xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-base leading-8 text-subtitle sm:text-lg">
            We provide the tools so you can focus on providing the best
            cleaning service. Manage your business from your pocket.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Badge
              variant="outline"
              className="rounded-full border-landing-primary/20 bg-white px-4 py-2 text-sm font-semibold text-title"
            >
              <CheckCircle2 className="size-4 text-landing-primary" />
              Fast Payouts
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-landing-primary/20 !bg-white px-4 py-2 text-sm font-semibold text-title"
            >
              <Headphones className="size-4 text-landing-primary" />
              24/7 support
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="rounded-[28px] border-landing-primary/35 bg-landing-primary-faint gap-1  px-5 py-5 shadow-[0_24px_60px_-42px_rgba(57,182,255,0.6)]"
            >
              <Icon className="size-5 text-landing-primary mb-3" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-[-0.03em] text-title">
                  {title}
                </h3>
                <p className="text-sm leading-5 text-subtitle sm:text-sm">
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
