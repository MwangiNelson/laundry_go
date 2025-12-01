import { Form } from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PhoneInput } from "@/components/fields/inputs/phone_input";
import { FileUpload } from "@/components/fields/files/basic_image_input";
import { TBusinessInformation } from "../onboarding_utils";

export const OnboardingBusinessInformation = () => {
  const { business_info_form } = useOnboarding();

  return (
    <Form {...business_info_form}>
      <form className="flex flex-col gap-4">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h2 className="font-manrope font-bold text-2xl md:text-[32px] leading-tight text-title">
            Business Information
          </h2>
          <p className="font-manrope text-sm leading-normal text-subtitle">
            Complete your profile details
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* Business Name */}
          <BasicInput<TBusinessInformation>
            control={business_info_form.control}
            name="business_name"
            label="Business Name"
            placeholder="LaundrySmart"
          />

          {/* Phone Number & Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <PhoneInput<TBusinessInformation>
              control={business_info_form.control}
              name="phone_number"
              label="Phone Number"
              placeholder="Enter number"
              defaultCountryCode="KE"
            />
            <BasicInput<TBusinessInformation>
              control={business_info_form.control}
              name="address"
              label="Location"
              placeholder="Enter location"
            />
          </div>

          {/* File Uploads Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload<TBusinessInformation>
              control={business_info_form.control}
              name="logo"
              label="Upload Logo"
              accept="image/png,image/jpeg,image/gif"
              multiple={false}
              placeholder="Browse photo"
              description="PNG, JPG or GIF (max 3MB)"
            />
            <FileUpload<TBusinessInformation>
              control={business_info_form.control}
              name="business_lincense"
              label="Upload Business License (Optional)"
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
