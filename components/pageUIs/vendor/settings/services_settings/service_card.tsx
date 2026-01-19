"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { VendorServiceData } from "@/api/vendor/services/use_get_vendor_services";
import { ServiceForm } from "./service_form";

interface ServiceCardProps {
  service: VendorServiceData;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border bg-card transition-all">
      {/* Service Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-manrope font-medium text-base">
              {service.main_service_name}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {service.service_items.length}{" "}
              {service.service_items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Service Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t">
          <ServiceForm service={service} />
        </div>
      )}
    </div>
  );
};
