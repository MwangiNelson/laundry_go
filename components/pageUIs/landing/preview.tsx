import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BellRing, Search } from "lucide-react";
import PreviewPhoto from "@/public/images/dash_preview.jpg";
import Image from "next/image";

const stats = [
  {
    label: "Total Orders",
    value: "125,600",
  },
  {
    label: "Completed",
    value: "24,000",
  },
  {
    label: "Monthly Revenue",
    value: "18,500",
  },
  {
    label: "New Requests",
    value: "41,300",
  },
];

const reports = [
  {
    title: "Orders Report",
    description:
      "Download weekly and monthly performance snapshots for your team.",
    items: ["Weekly summary", "Paid orders", "Pickup tracking"],
  },
  {
    title: "Financial Report",
    description:
      "Keep an eye on income, payouts, and account health across the week.",
    items: ["Gross revenue", "Settled payouts", "Pending balance"],
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Preview() {
  return (
    <section
      id="preview"
      className=" py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-title sm:text-4xl">
            Manage your shop on the go
          </h2>
          <p className="mt-4 text-base leading-8 text-subtitle">
            Our vendor dashboard is built for efficiency and speed.
          </p>
        </div>

        <Card className="mt-12 overflow-hidden gap-0 rounded-[36px] border-white/80 bg-white px-0 py-0 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.35)]">
          <div className="border-b border-border/60 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#fca5a5]" />
                <span className="size-3 rounded-full bg-landing-accent" />
                <span className="size-3 rounded-full bg-landing-primary-light" />
              </div>

              <div className="hidden h-11 flex-1 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-subtitle md:flex">
                laundrygo.glitexsolutions.co.ke/dashboard
              </div>

              <div className="ml-auto flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-title">
                <BellRing className="size-4 text-landing-primary" />
                LaundryGo Vendor
              </div>
            </div>
          </div>

          <div className="">
            <Image
              src={PreviewPhoto}
              alt="LaundryGo vendor dashboard preview"
              width={1160}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
