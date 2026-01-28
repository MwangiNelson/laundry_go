"use client";

import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { useSettings } from "./settings_context";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { FileUpload } from "@/components/fields/files/basic_image_input";
import { Button } from "@/components/ui/button";
import { TBusinessProfile } from "./settings_utils";
import { ArrowRight, MapPin } from "lucide-react";
import { ProfilePhotoUpload } from "@/components/fields/files/profile_photo_upload";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { GoogleMapsAutocomplete } from "@/components/fields/google_maps/google_auto_complete";
import { MapPicker } from "@/components/fields/google_maps/map_piker";

export const BusinessProfileSettings = () => {
  const {
    business_profile_form,
    onUpdateBusinessProfile,
    isUpdatingBusinessProfile,
  } = useSettings();

  const handleSubmit = business_profile_form.handleSubmit(
    onUpdateBusinessProfile
  );
  const { vendor } = useVendor();

  return (
    <Form {...business_profile_form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="w-full max-w-[276px]">
            <ProfilePhotoUpload<TBusinessProfile>
              control={business_profile_form.control}
              name="logo"
              label="Upload Logo"
              description="PNG, JPG or GIF (max 3MB)"
              // defaultImage={vendor?.logo_url}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2   2xl:grid-cols-4 gap-4">
            <BasicInput<TBusinessProfile>
              control={business_profile_form.control}
              name="business_name"
              label="Business Name"
              placeholder="LaundrySmart"
            />
            <PhoneInput<TBusinessProfile>
              control={business_profile_form.control}
              name="phone_number"
              label="Phone Number"
              placeholder="12345678"
              defaultCountryCode="KE"
            />
            <BasicInput<TBusinessProfile>
              control={business_profile_form.control}
              name="email"
              label="Email Address"
              placeholder="email@email.com"
              type="email"
            />
          </div>

          <div className="space-y-4">
            <GoogleMapsAutocomplete
              control={business_profile_form.control}
              name="location"
              label="Location"
              placeholder="Search for your school location..."
              icon={MapPin}
              iconPosition="start"
            />

            {business_profile_form.watch("location")?.coordinates?.lat &&
            business_profile_form.watch("location")?.coordinates?.lng ? (
              <FormField
                control={business_profile_form.control}
                name="location"
                render={({ field }) => (
                  <MapPicker
                    value={field.value || null}
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
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-24"
            loading={isUpdatingBusinessProfile}
          >
            Update
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
