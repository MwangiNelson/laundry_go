"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { faker } from "@faker-js/faker";
import { cn } from "@/lib/utils";

// Generate mock order data
const generateOrderData = () => {
  const items = [
    {
      name: "Curtains",
      quantity: faker.number.int({ min: 1, max: 5 }),
      services: ["Cleaning"],
    },
    {
      name: "Sheets",
      quantity: faker.number.int({ min: 2, max: 6 }),
      services: ["Cleaning", "Ironing"],
    },
    {
      name: "Shoes",
      quantity: faker.number.int({ min: 1, max: 4 }),
      services: ["Cleaning"],
    },
    {
      name: "Beddings",
      quantity: faker.number.int({ min: 2, max: 5 }),
      services: ["Cleaning", "Ironing"],
    },
  ];

  const customerName = faker.person.fullName();
  const customerEmail = faker.internet.email().toLowerCase();
  const customerAvatar = faker.image.avatarGitHub();
  const orderNumber = faker.number.int({ min: 1000, max: 9999 });
  const totalAmount = faker.number.int({ min: 8000, max: 25000 });
  const location = `${faker.number.int({
    min: 1,
    max: 999,
  })} ${faker.location.street()}, ${faker.helpers.arrayElement([
    "Westlands",
    "Kilimani",
    "Karen",
    "Lavington",
    "Parklands",
    "Riverside",
  ])}`;
  const timeSlot = faker.helpers.arrayElement([
    "Today 2-4 PM",
    "Tomorrow 10-12 AM",
    "Tomorrow 2-4 PM",
    "Today 4-6 PM",
  ]);
  const minutesAgo = faker.number.int({ min: 1, max: 30 });

  return {
    orderNumber,
    customerName,
    customerEmail,
    customerAvatar,
    items,
    totalAmount,
    location,
    timeSlot,
    minutesAgo,
  };
};

export const NewOrderModal = () => {
  const [open, setOpen] = useState(false);
  const [orderData] = useState(generateOrderData());

  const handleAccept = () => {};

  const handleReject = () => {};

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <DialogContent
      showCloseButton={false}
      className="sm:max-w-3xl p-0 rounded-3xl bg-background border border-foreground/10 overflow-hidden"
    >
      <DialogTitle className="sr-only">New Laundry Order</DialogTitle>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-xl font-semibold text-foreground font-manrope">
              Laundry
            </h2>
            <p className="text-xs text-muted-foreground tracking-[0.5px] font-manrope">
              {orderData.minutesAgo} mins
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Order Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h3 className="text-lg font-medium text-foreground font-manrope">
              Order #{orderData.orderNumber}
            </h3>
            <Badge className="bg-transparent border-none px-0 py-0 gap-0 h-auto">
              <div className="size-4 flex items-center justify-center">
                <div className="size-2 rounded-full bg-destructive" />
              </div>
              <span className="text-base font-normal text-destructive font-manrope">
                New
              </span>
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              className="border-primary text-foreground bg-transparent hover:bg-primary/10 rounded-xl px-4 py-2 h-auto gap-2"
              onClick={handleReject}
            >
              <X className="size-4" />
              <span className="text-sm font-normal font-manrope">
                Reject Order
              </span>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 h-auto gap-2"
              onClick={handleAccept}
            >
              <Check className="size-4" />
              <span className="text-sm font-normal font-manrope">
                Accept Order
              </span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="px-6 space-y-6">
            <p className="text-sm text-muted-foreground font-normal font-manrope">
              Customer Info
            </p>
            <div className="flex items-start gap-2">
              <Avatar className="size-16 border-2 border-orange-400">
                <AvatarImage
                  src={orderData.customerAvatar}
                  alt={orderData.customerName}
                />
                <AvatarFallback className="bg-orange-400/10 text-orange-400 font-medium">
                  {orderData.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <p className="text-base text-foreground font-normal font-manrope leading-[1.6]">
                  {orderData.customerName}
                </p>
                <p className="text-xs text-muted-foreground font-normal font-manrope tracking-[0.5px] leading-[1.4]">
                  {orderData.customerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Table */}
          <div className="bg-card rounded-2xl p-6 space-y-6">
            <div className="w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 border-b border-foreground/20 pb-2">
                <div className="col-span-5 px-3 py-2">
                  <p className="text-sm text-muted-foreground font-normal font-manrope">
                    Order Item
                  </p>
                </div>
                <div className="col-span-2 px-3 py-2">
                  <p className="text-sm text-muted-foreground font-normal font-manrope">
                    No.
                  </p>
                </div>
                <div className="col-span-5 px-3 py-2">
                  <p className="text-sm text-muted-foreground font-normal font-manrope">
                    Service
                  </p>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-foreground/5">
                {orderData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 py-2">
                    <div className="col-span-5 px-3 py-2">
                      <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                        {item.name}
                      </p>
                    </div>
                    <div className="col-span-2 px-3 py-2">
                      <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                        {item.quantity}
                      </p>
                    </div>
                    <div className="col-span-5 px-3 py-2">
                      <p className="text-base text-card-foreground font-normal font-manrope leading-[1.6]">
                        {item.services.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-end">
              <p className="text-base font-bold text-card-foreground font-manrope leading-[1.6]">
                kes {orderData.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Location and Time */}
          <div className="flex items-end">
            <p className="text-base text-muted-foreground font-normal font-manrope leading-[1.6]">
              Location: {orderData.location} Time: {orderData.timeSlot}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
