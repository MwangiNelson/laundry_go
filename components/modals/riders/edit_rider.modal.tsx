"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { BasicSelect } from "@/components/fields/select/basic_select";
import { SimpleSelect } from "@/components/fields/select/simple_select";
import { ProfilePhotoUpload } from "@/components/fields/files/profile_photo_upload";
import { Save } from "lucide-react";
import { ICreateRiderFormData, create_rider_schema } from "./rider_utils";
import { useUpdateRider } from "@/api/vendor/riders/use_manage_rider";
import { useGetRider } from "@/api/vendor/riders/use_fetch_rider";
import { get_profile } from "@/api/supabase/functions";

type EditRiderModalProps = {
  trigger?: React.ReactNode;
  riderId: string;
};

const vehicleOptions = [
  { value: "motorbike", label: "Motorbike" },
  { value: "bicycle", label: "Bicycle" },
  { value: "car", label: "Car" },
  { value: "van", label: "Van" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export const EditRiderModal: React.FC<EditRiderModalProps> = ({
  trigger,
  riderId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: rider, isLoading: isLoadingRider } = useGetRider(riderId);
  const { mutateAsync: updateRider, isPending } = useUpdateRider();

  const form = useForm<ICreateRiderFormData>({
    resolver: zodResolver(create_rider_schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      license: "",
      vehicle: "",
      vehiclePlate: "",
      notes: "",
      status: "active",
    },
  });

  // Populate form when rider data is loaded
  useEffect(() => {
    if (rider && open) {
      form.reset({
        name: rider.user?.full_name || "",
        phone: rider.user?.phone || "",
        email: rider.user?.email || "",
        license: rider.id_number || "",
        vehicle: rider.assigned_vehicle || "",
        vehiclePlate: rider.vehicle_plate || "",
        notes: rider.notes || "",
        status: rider.status || "active",
      });
    }
  }, [rider, open, form]);

  const handleComplete = async (data: ICreateRiderFormData) => {
    if (!rider) return;
    
    const userId = rider.user_id;
    if (!userId) return;

    await updateRider({
      riderId: rider.id,
      userId: userId,
      currentAvatarUrl: rider.user?.avatar_url ?? null,
      data,
    });
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const avatarUrl: string | undefined = get_profile(rider?.user_id ?? "");
 return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-4xl p-0 rounded-3xl bg-background border-none overflow-hidden">
        <DialogTitle className="sr-only">Edit Rider</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleComplete)}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between mt-8">
                <h2 className="text-lg font-bold text-foreground">Edit Rider</h2>
                <div className="flex items-center gap-2">
                  <SimpleSelect
                    name="status"
                    control={form.control}
                    options={statusOptions}
                    placeholder="Select Status"
                  />
                </div>
              </div>

              {isLoadingRider ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading rider data...</p>
                </div>
              ) : (
                <>
                  {/* Form Fields */}
                  <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
                    {/* Profile Photo */}
                    <div className="space-y-2">
                      <ProfilePhotoUpload
                        name="profilePhoto"
                        control={form.control}
                        defaultImage={avatarUrl || undefined}
                        label="Profile Photo"
                        description="PNG, JPG or GIF (max 3MB)"
                        size="lg"
                        shape="circle"
                      />
                    </div>

                    {/* Row 1: Name, Phone, Email */}
                    <div className="grid grid-cols-3 gap-4">
                      <BasicInput
                        name="name"
                        control={form.control}
                        label="Name"
                        placeholder="Kevin Maina"
                      />
                      <PhoneInput
                        name="phone"
                        control={form.control}
                        label="Phone"
                        placeholder="11462746"
                      />
                      <BasicInput
                        name="email"
                        control={form.control}
                        label={
                          <span className="flex items-center justify-between w-full">
                            <span>Email</span>
                            <span className="text-label font-medium">
                              (optional)
                            </span>
                          </span>
                        }
                        placeholder="email@gmail.com"
                      />
                    </div>

                    {/* Row 2: License, Vehicle, Vehicle Plate */}
                    <div className="grid grid-cols-3 gap-4">
                      <BasicInput
                        name="license"
                        control={form.control}
                        label="ID/License Number"
                        placeholder="01234"
                      />
                      <BasicSelect
                        name="vehicle"
                        control={form.control}
                        label="Assigned Vehicle"
                        placeholder="Select vehicle"
                        options={vehicleOptions}
                      />
                      <BasicInput
                        name="vehiclePlate"
                        control={form.control}
                        label="Vehicle Plate"
                        placeholder="KAA 123A"
                      />
                    </div>

                    {/* Notes */}
                    <BasicInput
                      name="notes"
                      control={form.control}
                      label={
                        <span className="flex items-center justify-between w-full">
                          <span>Notes</span>
                          <span className="text-label font-medium">
                            (optional)
                          </span>
                        </span>
                      }
                      placeholder="Type something..."
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-foreground gap-1"
                      loading={isPending}
                    >
                      <Save size={16} />
                      {isPending ? "Updating..." : "Update Rider"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
};

