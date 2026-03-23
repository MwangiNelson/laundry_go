"use client";

import { FileUpload } from "@/components/fields/files/basic_image_input";
import { ProfilePhotoUpload } from "@/components/fields/files/profile_photo_upload";
import { GoogleMapsAutocomplete } from "@/components/fields/google_maps/google_auto_complete";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { Form } from "@/components/ui/form";
import { MapPin } from "lucide-react";
import { useOnboarding } from "../onboarding_context";
import { TBusinessInformation } from "../onboarding_utils";

export const OnboardingBusinessInformation = () => {
  const { business_info_form } = useOnboarding();

  return (
    <Form {...business_info_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Business Information
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Complete your profile details
          </p>
        </div>

        <BasicInput<TBusinessInformation>
          control={business_info_form.control}
          name="business_name"
          label="Business Name"
          placeholder="LaundrySmart"
          className="rounded-xl px-3 py-2.5"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneInput<TBusinessInformation>
            control={business_info_form.control}
            name="phone_number"
            label="Work Phone Number"
            placeholder="Enter number"
            defaultCountryCode="KE"
            className="rounded-xl px-3 py-2.5"
          />
          <GoogleMapsAutocomplete
            control={business_info_form.control}
            name="location"
            label="Location"
            placeholder="Enter location"
            icon={MapPin}
            iconPosition="start"
            groupClassName="rounded-xl px-3 py-2.5"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-title">Upload Logo</p>
            <ProfilePhotoUpload<TBusinessInformation>
              control={business_info_form.control}
              name="logo"
              label=""
              description="PNG, JPG or GIF (max 5MB)"
              shape="rounded"
              size="md"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-title">
              Upload Business License (Optional)
            </p>
            <FileUpload<TBusinessInformation>
              control={business_info_form.control}
              name="business_license"
              label=""
              accept=".pdf"
              multiple={false}
              placeholder="Browse doc"
              description="PDF"
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
