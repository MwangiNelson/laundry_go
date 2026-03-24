"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { VendorServiceData } from "@/api/vendor/services/use_get_vendor_services";
import { useDeleteVendorService } from "@/api/vendor/services/use_vendor_price_mutations";
import { ServiceForm } from "./service_form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ServiceCardProps {
  service: VendorServiceData;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const deleteMutation = useDeleteVendorService();

  const pricingCount =
    service.service_type === "main"
      ? service.item_pricing.length + (service.kg_pricing ? 1 : 0)
      : service.room_rates.length;

  return (
    <div className="rounded-xl border bg-card transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-manrope font-medium text-base">
              {service.service_name}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full capitalize">
              {service.service_type}
            </span>
            <span className="text-xs text-muted-foreground">
              {pricingCount} {pricingCount === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDelete(true);
            }}
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive transition-colors"
            aria-label={`Remove ${service.service_name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t">
          <ServiceForm service={service} />
        </div>
      )}

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {service.service_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the service and all its pricing entries. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate({ id: service.id })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
