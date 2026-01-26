"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMainServices } from "@/api/vendor/services/use_get_main_services";
import { useGetVendorServices } from "@/api/vendor/services/use_get_vendor_services";
import { Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AddServiceDialogProps {
  trigger?: React.ReactNode;
  onServiceSelected?: (mainServiceId: number, slug: string) => void;
}

export const AddServiceDialog = ({
  trigger,
  onServiceSelected,
}: AddServiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const { data: mainServices = [], isLoading } = useGetMainServices();
  const { data: vendorServices = [] } = useGetVendorServices();

  // Get IDs of services the vendor already has
  const vendorServiceIds = vendorServices.map((vs) => vs.main_service_id);

  // Filter out services the vendor already has
  const availableServices = mainServices.filter(
    (service) => !vendorServiceIds.includes(service.id)
  );

  const handleAddService = () => {
    if (!selectedServiceId) return;

    const selectedService = mainServices.find(
      (s) => s.id === selectedServiceId
    );
    if (selectedService && onServiceSelected) {
      onServiceSelected(selectedServiceId, selectedService.slug);
    }
    setOpen(false);
    setSelectedServiceId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
          <DialogDescription>
            Select a service you want to offer. You'll be able to set prices for
            items after adding.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </>
          ) : availableServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You've added all available services!</p>
              <p className="text-sm mt-2">
                Great job! You can now configure pricing for each service.
              </p>
            </div>
          ) : (
            availableServices.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedServiceId(service.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:border-primary/50",
                  selectedServiceId === service.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{service.service}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {service.slug.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {selectedServiceId === service.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </button>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedServiceId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddService}
            disabled={!selectedServiceId || availableServices.length === 0}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
