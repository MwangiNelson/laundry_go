"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { BasicSelect } from "@/components/fields/select/basic_select";
import { SimpleSelect } from "@/components/fields/select/simple_select";
import { FileUpload } from "@/components/fields/files/basic_image_input";
import { X, Save } from "lucide-react";
import { ICreateRiderFormData, create_rider_schema } from "./rider_utils";
import { useCreateRider } from "@/api/vendor/riders/use_manage_rider";

type CreateRiderModalProps = {
  trigger?: React.ReactNode;
  vendorId: string;
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

export const CreateRiderModal: React.FC<CreateRiderModalProps> = ({
  trigger,
  vendorId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync: createRider, isPending } = useCreateRider();

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

  const handleComplete = async (data: ICreateRiderFormData) => {
    await createRider(data);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-4xl p-0 rounded-3xl bg-background border-none overflow-hidden">
        <DialogTitle className="sr-only">Add Rider</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleComplete)}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between mt-8">
                <h2 className="text-lg font-bold text-foreground">Add Rider</h2>
                <div className="flex items-center gap-2">
                  <SimpleSelect
                    name="status"
                    control={form.control}
                    options={statusOptions}
                    placeholder="Select Status"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
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

                {/* Upload Profile Photo */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground">
                    Upload Profile Photo
                  </h3>
                  <FileUpload
                    name="profilePhoto"
                    control={form.control}
                    accept="image/png,image/jpeg,image/gif"
                    multiple={false}
                    placeholder="Browse photo"
                    description="PNG, JPG or GIF (max 3MB)"
                    className="max-w-[280px]"
                  />
                </div>

                {/* Notes */}
                <BasicInput
                  name="notes"
                  control={form.control}
                  label={
                    <span className="flex items-center justify-between w-full">
                      <span>Notes</span>
                      <span className="text-label font-medium">(optional)</span>
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
                  {isPending ? "Saving..." : "Save Rider"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
