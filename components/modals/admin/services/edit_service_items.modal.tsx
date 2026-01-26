import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { ProfilePhotoUpload } from "@/components/fields/files/profile_photo_upload";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import BasicSelect from "@/components/fields/select/basic_select";
import { useEditServiceItem } from "../../../../api/admin/services/use_services.admin";
import { Database } from "@/database.types";

const schema = z.object({
  image: z.instanceof(File).optional(),
  service_item: z.string().min(1, "Service item name is required"),
  service_options: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      description: z.string().nullable(),
      display_order: z.number().min(0),
      enabled: z.boolean(),
    })
  ),
  status: z.enum(["active", "inactive"]),
  main_service_id: z.number().min(1, "Main service is required"),
});

export type IEditServiceItemModalSchema = z.infer<typeof schema>;

type ServiceItem = Database['public']['Tables']['service_items']['Row'] & {
  service_options: Database['public']['Tables']['service_options']['Row'][];
};

interface EditServiceItemModalProps {
  trigger?: React.ReactNode;
  serviceItem: ServiceItem;
  serviceSlug?:
    | "laundry"
    | "moving"
    | "office_cleaning"
    | "fumigation"
    | "house_cleaning";
  onEdit?: (data: IEditServiceItemModalSchema) => Promise<void>;
  isEditing?: boolean;
}

const STANDARD_OPTIONS: Record<
  string,
  { name: string; description: string | null; display_order: number }[]
> = {
  laundry: [
    { name: "Cleaning", description: null, display_order: 1 },
    { name: "Ironing", description: null, display_order: 2 },
  ],
  house_cleaning: [
    { name: "Regular Clean", description: null, display_order: 1 },
    { name: "Deep Clean", description: null, display_order: 2 },
  ],
  office_cleaning: [
    { name: "Regular Clean", description: null, display_order: 1 },
    { name: "Deep Clean", description: null, display_order: 2 },
  ],
  moving: [],
  fumigation: [],
};

export const EditServiceItemModal = ({
  trigger,
  serviceItem,
  serviceSlug,
  onEdit,
  isEditing = false,
}: EditServiceItemModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: editServiceItem, isPending: isEditingItem } =
    useEditServiceItem();

  // Map existing service options to form structure
  const existingOptions = useMemo(() => {
    return (
      serviceItem.service_options?.map((opt) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description,
        display_order: opt.display_order || 0,
        enabled: opt.is_active ?? true,
      })) || []
    );
  }, [serviceItem.service_options]);

  // Get standard options for the service type
  const standardOptions = useMemo(() => {
    if (!serviceSlug) {
      // If no service slug provided, just use existing options
      return existingOptions;
    }

    const standardOpts = STANDARD_OPTIONS[serviceSlug] || [];

    // Merge existing options with standard options
    const mergedOptions = standardOpts.map((stdOpt) => {
      const existing = existingOptions.find(
        (opt) => opt.name === stdOpt.name
      );
      return (
        existing || {
          id: undefined,
          name: stdOpt.name,
          description: stdOpt.description,
          display_order: stdOpt.display_order,
          enabled: false,
        }
      );
    });

    // Add any existing options that aren't in standard options
    existingOptions.forEach((existing) => {
      if (!mergedOptions.find((opt) => opt.name === existing.name)) {
        mergedOptions.push(existing);
      }
    });

    return mergedOptions;
  }, [existingOptions, serviceSlug]);

  const hasOptions = standardOptions.length > 0;

  const form = useForm<IEditServiceItemModalSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_item: serviceItem.name || "",
      service_options: standardOptions,
      status: serviceItem.is_active ? "active" : "inactive",
      main_service_id: serviceItem.main_service_id || 0,
    },
  });

  useEffect(() => {
    if (open && serviceItem) {
      form.reset({
        service_item: serviceItem.name || "",
        service_options: standardOptions,
        status: serviceItem.is_active ? "active" : "inactive",
        main_service_id: serviceItem.main_service_id || 0,
      });
    }
  }, [open, form, serviceItem, standardOptions]);

  const handleSubmit = async (data: IEditServiceItemModalSchema) => {
    if (onEdit) {
      await onEdit(data).then(() => {
        setOpen(false);
      });
    } else {
      await editServiceItem({
        id: serviceItem.id,
        data,
        oldIconPath: serviceItem.icon_path,
      }).then(() => {
        setOpen(false);
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-2xl space-y-4 rounded-3xl bg-background border-none overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle>Edit Service Item - {serviceItem.name}</DialogTitle>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>

              <ProfilePhotoUpload
                name="image"
                control={form.control}
                label="Service Item Image (Optional)"
                defaultImage={serviceItem.icon_path || undefined}
              />

              <BasicInput
                name="service_item"
                control={form.control}
                label="Service Item Name"
                placeholder="e.g., Shirts, Trousers, Dresses"
              />
              <BasicSelect
                control={form.control}
                name="status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                label="Status"
                description="The status of the service item"
              />
            </div>

            {hasOptions && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold">Service Options</h3>
                  <p className="text-xs text-muted-foreground">
                    Select which service options you want to offer for this item
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {standardOptions.map((option, index) => {
                    const watchedOption = form.watch(
                      `service_options.${index}`
                    );
                    return (
                      <div
                        key={option.id || option.name}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border transition-all",
                          watchedOption?.enabled
                            ? "bg-background border-primary/20"
                            : "bg-muted/20 border-muted opacity-60"
                        )}
                      >
                        <Switch
                          checked={watchedOption?.enabled}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              `service_options.${index}.enabled`,
                              checked
                            );
                          }}
                        />

                        <div className="flex-1">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              watchedOption?.enabled
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {option.name}
                          </span>
                          {option.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasOptions && (
              <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
                <p className="text-sm text-muted-foreground text-center">
                  This service type does not require additional options. Pricing
                  will be set directly on the item.
                </p>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isEditing || isEditingItem}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isEditing || isEditingItem}
                onClick={() => {
                  console.log({
                    formData: form.getValues(),
                    formErrors: form.formState.errors,
                  });
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

