"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { FileUpload } from "@/components/fields/files/basic_image_input";
import { MapPin, X } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { GoogleMapsAutocomplete } from "@/components/fields/google_maps/google_auto_complete";
import { MapPicker } from "@/components/fields/google_maps/map_piker";
import { locationSchema } from "@/components/schema/shared.schema";

type EditProfileModalProps = {
  trigger?: React.ReactNode;
};
const schema = z.object({
  username: z.string().min(2).max(50),
  businessName: z.string().min(2).max(100),
  phone: z.string().min(7).max(15),
  email: z.string().email(),
  location: locationSchema,
  profile_photo: z.instanceof(File).optional(),
});
type EditProfileFormData = z.infer<typeof schema>;

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  trigger,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      businessName: "",
      phone: "",
      email: "",
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // TODO: Handle save logic
    handleClose();
  };
  const handleComplete = (data: EditProfileFormData) => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl p-0 rounded-lg bg-background border border-border overflow-hidden"
      >
        <DialogTitle className="sr-only">Edit Details</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleComplete)}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-title">Edit Profile</h2>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground"
                  type={"button"}
                >
                  <X size={24} />
                </button>
              </div>

              <div className=" max-h-[50vh] overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <BasicInput
                    name="username"
                    label="Username"
                    placeholder="Beatrice Githinji"
                    control={form.control}
                  />
                  <BasicInput
                    name="businessName"
                    label="Business Name"
                    placeholder="12345678"
                    control={form.control}
                  />
                  <PhoneInput
                    name="phone"
                    label="Phone Number"
                    placeholder="12345678"
                    control={form.control}
                  />
                  <BasicInput
                    name="email"
                    label="Email Address"
                    placeholder="beatrice@admin.com"
                    control={form.control}
                  />
                </div>
                <GoogleMapsAutocomplete
                  control={form.control}
                  name="location"
                  label="Location"
                  placeholder="Search for your school location..."
                  icon={MapPin}
                  iconPosition="start"
                />

                {form.watch("location")?.coordinates?.lat &&
                form.watch("location")?.coordinates?.lng ? (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <MapPicker
                        value={field.value}
                        onChange={(
                          coordinates: { lat: number; lng: number } | null
                        ) => {
                          field.onChange({
                            ...field.value,
                            coordinates,
                          });
                        }}
                      />
                    )}
                  />
                ) : null}

                <div className="flex flex-col items-center gap-4 py-6">
                  <h3 className="text-base font-semibold text-title">
                    Edit Profile
                  </h3>
                  <FileUpload
                    name="profile_photo"
                    accept="image/png,image/jpeg,image/gif"
                    multiple={false}
                    placeholder="Browse Photo"
                    description="PNG, JPG or GIF (max 3MB)"
                    className="max-w-[280px]"
                    control={form.control}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
