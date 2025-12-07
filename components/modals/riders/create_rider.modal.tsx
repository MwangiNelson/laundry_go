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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  license: z.string().min(1, "License is required"),
  vehicle: z.string().min(1, "Vehicle type is required"),
  vehiclePlate: z.string().min(1, "Vehicle plate is required"),
  profilePhoto: z
    .instanceof(File, { message: "Profile photo is required" })
    .optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type CreateRiderModalProps = {
  trigger?: React.ReactNode;
  onSubmit?: (data: FormData) => void;
  isLoading?: boolean;
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
  onSubmit,
  isLoading = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      license: "",
      vehicle: "",
      vehiclePlate: "",
      notes: "",
      status: "",
    },
  });

  const handleComplete = (data: FormData) => {
    onSubmit?.(data);
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
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
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
                  disabled={isLoading}
                >
                  <Save size={16} />
                  Save Rider
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
