import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
  headline?: string;
  description?: string;
  activeSlide?: number;
  totalSlides?: number;
};

const VendorAuthPageUI = ({
  children,
  headline = "Expand Your Services. Automate Your Earnings.",
  description = "Join the all-in-one platform for Laundry, Home Cleaning, Moving, and more. Manage all orders and track your commission-based payouts with clarity and ease.",
  activeSlide = 0,
  totalSlides = 3,
}: Props) => {
  return (
    <div className="w-screen min-h-screen relative overflow-x-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={`/vendors/auth/bg.png`}
          alt="Background Image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/55" />
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-[62px] lg:pt-[123px]">
          <div className="mb-6 lg:mb-0">
            <Image
              src="/logos/main.svg"
              alt="LaundryGo!"
              width={202}
              height={47}
              className="w-[150px] sm:w-[180px] lg:w-[202px] h-auto"
            />
          </div>

          <div className="hidden lg:flex flex-col gap-6 max-w-[563px] pb-20">
            <div className="flex flex-col gap-2">
              <h1 className="font-manrope font-bold text-[32px] xl:text-[48px] leading0tight text-background">
                {headline}
              </h1>
              <p className="font-manrope font-normal text-[14px] xl:text-[16px] leading-[1.6] text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-10 xl:w-16 rounded-[34px] ${
                    index === activeSlide
                      ? "bg-background"
                      : "bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:pr-[62px]">
          <Card className="w-full max-w-[645px] rounded-[25px] bg-background p-4 sm:p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]">
            {children}
          </Card>
        </div>

        <div className="lg:hidden flex flex-col gap-4 p-6 sm:p-8 pt-0">
          <div className="flex flex-col gap-2">
            <h1 className="font-manrope font-bold text-[24px] sm:text-[32px] leading-tight text-background">
              {headline}
            </h1>
            <p className="font-manrope font-normal text-[14px] leading-[1.6] text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`h-1 w-10 rounded-[34px] ${
                  index === activeSlide
                    ? "bg-background"
                    : "bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAuthPageUI;
