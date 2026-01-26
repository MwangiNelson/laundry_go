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
import {
  useAddServiceItem,
  useGetMainServiceBySlug,
} from "../../../../api/admin/services/use_services.admin";
import BasicSelect from "@/components/fields/select/basic_select";

const schema = z.object({
  image: z.instanceof(File).optional(),
  service_item: z.string().min(1, "Service item name is required"),
  service_options: z.array(
    z.object({
      name: z.string(),
      description: z.string().nullable(),
      display_order: z.number().min(0),
      enabled: z.boolean(),
    })
  ),
  status: z.enum(["active", "inactive"]),
  main_service_id: z.number().min(1, "Main service is required"),
});

export type IAddServiceItemModalSchema = z.infer<typeof schema>;

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

interface AddMainServiceItemProps {
  trigger?: React.ReactNode;
  service_slug:
    | "laundry"
    | "moving"
    | "office_cleaning"
    | "fumigation"
    | "house_cleaning";
}

export const AddMainServiceItem = ({
  trigger,
  service_slug,
}: AddMainServiceItemProps) => {
  const [open, setOpen] = useState(false);
  const { data: mainService } = useGetMainServiceBySlug(service_slug);
  const { mutateAsync: addServiceItem, isPending: isAddingServiceItem } =
    useAddServiceItem();

  const standardOptions = useMemo(
    () => STANDARD_OPTIONS[service_slug] || [],
    [service_slug]
  );
  const hasOptions = standardOptions.length > 0;

  const form = useForm<IAddServiceItemModalSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_item: "",
      service_options: standardOptions.map((opt) => ({
        ...opt,
        enabled: true,
      })),
      status: "active",
      main_service_id: mainService?.id ? Number(mainService.id) : 0,
    },
  });

  useEffect(() => {
    if (open && mainService) {
      form.reset({
        service_item: "",
        service_options: standardOptions.map((opt) => ({
          ...opt,
          enabled: true,
        })),
        status: "active",
        main_service_id: Number(mainService.id),
      });
    }
  }, [open, form, standardOptions, mainService]);

  const handleSubmit = async (data: IAddServiceItemModalSchema) => {
    if (!mainService?.id) {
      console.error("Main service not loaded yet");
      return;
    }
    // Ensure main_service_id is set
    const submitData = {
      ...data,
      main_service_id: data.main_service_id || Number(mainService.id),
    };
    await addServiceItem(submitData).then(() => {
      setOpen(false);
    });
  };

  useEffect(() => {
    if (mainService) {
      form.setValue("main_service_id", Number(mainService.id));
    }
  }, [mainService, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-2xl space-y-4 rounded-3xl bg-background border-none overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle>Add Service Item - {mainService?.service}</DialogTitle>

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
              />

              <BasicInput
                name="service_item"
                control={form.control}
                label="Service Item Name"
                placeholder={
                  service_slug === "laundry"
                    ? "e.g., Shirts, Trousers, Dresses"
                    : "e.g., Kitchen, Living Room, Bedroom"
                }
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
                        key={option.name}
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
                disabled={isAddingServiceItem}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  console.log({
                    formData: form.getValues(),
                    formErrors: form.formState.errors,
                  });
                }}
                loading={isAddingServiceItem}
              >
                Add Service Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
