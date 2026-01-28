"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TBusinessProfile,
  TOperatingHours,
  TPayoutMethods,
  TSecurityAccount,
  business_profile_schema,
  operating_hours_schema,
  payout_methods_schema,
  security_account_schema,
} from "./settings_utils";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { useAuth } from "@/components/context/auth_provider";
import {
  useUpdateBusinessProfile,
  useUpdateOperatingHours,
  useUpdatePassword,
} from "@/api/vendor/management/use_manage_vendor";

interface SettingsContextType {
  business_profile_form: UseFormReturn<TBusinessProfile>;
  operating_hours_form: UseFormReturn<TOperatingHours>;
  payout_methods_form: UseFormReturn<TPayoutMethods>;
  security_account_form: UseFormReturn<TSecurityAccount>;
  onUpdateBusinessProfile: (data: TBusinessProfile) => Promise<void>;
  onUpdateOperatingHours: (data: TOperatingHours) => Promise<void>;
  onUpdatePayoutMethods: (data: TPayoutMethods) => Promise<void>;
  onUpdateSecurityAccount: (data: TSecurityAccount) => Promise<void>;
  isUpdatingBusinessProfile: boolean;
  isUpdatingOperatingHours: boolean;
  isUpdatingPassword: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
  // Default values can be passed for pre-populating forms
  defaultBusinessProfile?: Partial<TBusinessProfile>;
  defaultOperatingHours?: Partial<TOperatingHours>;
  defaultPayoutMethods?: Partial<TPayoutMethods>;
}

export const SettingsProvider = ({
  children,
  defaultBusinessProfile,
  defaultOperatingHours,
  defaultPayoutMethods,
}: SettingsProviderProps) => {
  const { vendor, user: vendorUser } = useVendor();
  const { user } = useAuth();

  const {
    mutateAsync: updateBusinessProfile,
    isPending: isUpdatingBusinessProfile,
  } = useUpdateBusinessProfile();
  const {
    mutateAsync: updateOperatingHours,
    isPending: isUpdatingOperatingHours,
  } = useUpdateOperatingHours();
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  const business_profile_form = useForm<TBusinessProfile>({
    resolver: zodResolver(business_profile_schema),
    defaultValues: {
      business_name: vendor?.business_name || "",
      phone_number: vendor?.phone || "",
      email: vendor?.email || "",
      logo: undefined,
      location: undefined,
      ...defaultBusinessProfile,
    },
  });

  // Update form when vendor data loads
  useEffect(() => {
    if (vendor && vendorUser) {
      const location = vendor?.location as any;
      business_profile_form.reset({
        business_name: vendor?.business_name || "",
        phone_number: vendor?.phone || "",
        email: vendor?.email || "",
        logo: undefined,
        location: location
          ? {
              place_id: location.place_id || undefined,
              description: location.description || null,
              main_text: location.main_text || undefined,
              secondary_text: location.secondary_text || undefined,
              coordinates: location.coordinates || undefined,
            }
          : undefined,
        ...defaultBusinessProfile,
      });
    }
  }, [vendor, vendorUser, defaultBusinessProfile]);

  const operating_hours_form = useForm<TOperatingHours>({
    resolver: zodResolver(operating_hours_schema),
    defaultValues: {
      sunday: undefined,
      monday: { start_time: "09:00", end_time: "17:00" },
      tuesday: { start_time: "09:00", end_time: "17:00" },
      wednesday: { start_time: "09:00", end_time: "17:00" },
      thursday: { start_time: "09:00", end_time: "17:00" },
      friday: { start_time: "09:00", end_time: "17:00" },
      saturday: undefined,
      ...defaultOperatingHours,
    },
  });

  // Load operation hours from vendor data
  useEffect(() => {
    if (vendor?.operation_hours) {
      const opHours = vendor.operation_hours as unknown as TOperatingHours;
      operating_hours_form.reset({
        sunday: opHours?.sunday ?? undefined,
        monday: opHours?.monday ?? { start_time: "09:00", end_time: "17:00" },
        tuesday: opHours?.tuesday ?? { start_time: "09:00", end_time: "17:00" },
        wednesday: opHours?.wednesday ?? {
          start_time: "09:00",
          end_time: "17:00",
        },
        thursday: opHours?.thursday ?? {
          start_time: "09:00",
          end_time: "17:00",
        },
        friday: opHours?.friday ?? { start_time: "09:00", end_time: "17:00" },
        saturday: opHours?.saturday ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor?.operation_hours]);

  const payout_methods_form = useForm<TPayoutMethods>({
    resolver: zodResolver(payout_methods_schema),
    defaultValues: {
      bank_name: "",
      account_name: "",
      account_number: "",
      ...defaultPayoutMethods,
    },
  });

  const security_account_form = useForm<TSecurityAccount>({
    resolver: zodResolver(security_account_schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onUpdateBusinessProfile = async (data: TBusinessProfile) => {
    if (!vendor?.id || !user?.id) {
      throw new Error("Vendor or user not found");
    }

    await updateBusinessProfile({
      vendor_id: vendor.id,
      user_id: user.id,
      business_name: data.business_name,
      phone_number: data.phone_number,
      email: data.email,
      logo: data.logo,
      current_logo_url: vendor?.logo_url ?? undefined,
      location: data.location,
      current_location_id: vendor?.location_id ?? undefined,
    });
  };

  const onUpdateOperatingHours = async (data: TOperatingHours) => {
    if (!vendor?.id) {
      throw new Error("Vendor not found");
    }

    // Convert form data to operation_hours format
    const operation_hours: Record<
      string,
      { start_time: string; end_time: string } | null
    > = {
      sunday: data.sunday || null,
      monday: data.monday || null,
      tuesday: data.tuesday || null,
      wednesday: data.wednesday || null,
      thursday: data.thursday || null,
      friday: data.friday || null,
      saturday: data.saturday || null,
    };

    await updateOperatingHours({
      vendor_id: vendor.id,
      operation_hours,
    });
  };

  const onUpdatePayoutMethods = async (data: TPayoutMethods) => {
    console.log("Updating payout methods:", data);
    // TODO: Implement API call
  };

  const onUpdateSecurityAccount = async (data: TSecurityAccount) => {
    // Validate that passwords match
    if (data.new_password !== data.confirm_password) {
      throw new Error("Passwords do not match");
    }

    await updatePassword({
      current_password: data.current_password,
      new_password: data.new_password,
    });

    // Reset form after successful update
    security_account_form.reset({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        business_profile_form,
        operating_hours_form,
        payout_methods_form,
        security_account_form,
        onUpdateBusinessProfile,
        onUpdateOperatingHours,
        onUpdatePayoutMethods,
        onUpdateSecurityAccount,
        isUpdatingBusinessProfile,
        isUpdatingOperatingHours,
        isUpdatingPassword,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
