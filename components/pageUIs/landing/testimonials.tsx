import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const stories = [
  {
    quote:
      "Since joining LaundryGo, my daily orders have tripled.The automated dispatch system makes management so easy.",
    name: "Rose Achieng",
    role: "Owner, CleanWaves",
    initials: "RA",
  },
  {
    quote:
      "The payout system is reliable.I never have to worry about chasing customers for payments anymore.",
    name: "Kevin Rono",
    role: "Manager, QuickWash",
    initials: "KR",
  },
  {
    quote:
      "Onboarding was seamless. I was receiving my first set of orders within 48 hours of registering.",
    name: "Rebecca Makena",
    role: "Founder, Aisha Laundry",
    initials: "RM",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-title sm:text-4xl">
            Vendor success stories
          </h2>
          <p className="mt-4 text-base leading-8 text-subtitle">
            Join the community of thriving laundry entrepreneurs.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {stories.map((story) => (
            <Card
              key={story.name}
              className="rounded-[28px] border-border/70 bg-white px-6 py-6 shadow-[0_22px_60px_-44px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center gap-1 text-landing-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${story.name}-${index}`}
                    className="size-4 fill-current"
                  />
                ))}
              </div>

              <p className="text-sm leading-7 text-subtitle sm:text-base">
                {story.quote}
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="size-12 bg-landing-primary-light">
                  <AvatarFallback className="bg-landing-primary-light text-sm font-bold text-landing-primary">
                    {story.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-title">{story.name}</p>
                  <p className="text-sm text-subtitle">{story.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
