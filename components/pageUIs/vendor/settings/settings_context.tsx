"use client";

import React, { createContext, useContext, ReactNode } from "react";
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

interface SettingsContextType {
  business_profile_form: UseFormReturn<TBusinessProfile>;
  operating_hours_form: UseFormReturn<TOperatingHours>;
  payout_methods_form: UseFormReturn<TPayoutMethods>;
  security_account_form: UseFormReturn<TSecurityAccount>;
  onUpdateBusinessProfile: (data: TBusinessProfile) => Promise<void>;
  onUpdateOperatingHours: (data: TOperatingHours) => Promise<void>;
  onUpdatePayoutMethods: (data: TPayoutMethods) => Promise<void>;
  onUpdateSecurityAccount: (data: TSecurityAccount) => Promise<void>;
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
  const business_profile_form = useForm<TBusinessProfile>({
    resolver: zodResolver(business_profile_schema),
    defaultValues: {
      username: "",
      business_name: "",
      phone_number: "",
      email: "",
      logo: undefined,
      ...defaultBusinessProfile,
    },
  });

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
    console.log("Updating business profile:", data);
    // TODO: Implement API call
  };

  const onUpdateOperatingHours = async (data: TOperatingHours) => {
    console.log("Updating operating hours:", data);
    // TODO: Implement API call
  };

  const onUpdatePayoutMethods = async (data: TPayoutMethods) => {
    console.log("Updating payout methods:", data);
    // TODO: Implement API call
  };

  const onUpdateSecurityAccount = async (data: TSecurityAccount) => {
    console.log("Updating security settings:", data);
    // TODO: Implement API call
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
