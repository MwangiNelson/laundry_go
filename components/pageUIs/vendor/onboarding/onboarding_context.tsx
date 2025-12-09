"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  OnboardingBusinessInformation,
  OnboardingOperationSetup,
  OnboardingServiceAndPricing,
} from "./steps";
import {
  TBusinessInformation,
  TOnboardingFormData,
  TOperationHours,
  TServiceAndPricing,
  business_information,
  convertToServiceTypes,
  operation_hours,
  service_and_pricing,
} from "./onboarding_utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchMainServices } from "@/api/vendor/onboarding/use_fetch_services";
import { useAuth } from "@/components/context/auth_provider";
import { useCreateVendor } from "@/api/vendor/onboarding/use_save_vendor";
import { useRouter } from "next/navigation";
const useOnboardingProvider = () => {
  const [current_step, set_current_step] = useState<number>(0);
  const [is_open, set_is_open] = useState<boolean>(false);
  const [completed_steps, set_completed_steps] = useState<number[]>([]);
  const { user } = useAuth();
  const { data: mainServices = [] } = useFetchMainServices();
  const { mutateAsync: createVendor, isPending: creating } = useCreateVendor();
  const router = useRouter();
  const SERVICE_TYPES = convertToServiceTypes(mainServices);

  const business_info_form = useForm<TBusinessInformation>({
    resolver: zodResolver(business_information),
    defaultValues: {
      business_name: "",
      email: "",
      address: "",
      phone_number: "",
      logo: undefined,
      business_lincense: undefined,
    },
  });
  const operation_hours_form = useForm<TOperationHours>({
    resolver: zodResolver(operation_hours),
    defaultValues: {},
  });
  const service_and_pricing_form = useForm<TServiceAndPricing>({
    resolver: zodResolver(service_and_pricing),
    defaultValues: {
      laundry: { enabled: false, items: [] },
      moving: { enabled: false, items: [] },
      house_cleaning: { enabled: false, items: [] },
      office_cleaning: { enabled: false, items: [] },
      fumigation: { enabled: false, items: [] },
    },
  });
  const steps = [
    {
      title: "Business Information",
      component: OnboardingBusinessInformation,
      schema: business_information,
      form: business_info_form,
    },
    {
      title: "Service and Pricing",
      component: OnboardingServiceAndPricing,
      schema: service_and_pricing,
      form: service_and_pricing_form,
    },
    {
      title: "Operation Setup",
      component: OnboardingOperationSetup,
      schema: operation_hours,
      form: operation_hours_form,
    },
  ];

  const is_in_last_step = current_step === steps.length - 1;
  const handleNextStep = async () => {
    if (is_in_last_step) {
      const data: TOnboardingFormData = {
        business_information: business_info_form.getValues(),
        operation_hours: operation_hours_form.getValues(),
        service_and_pricing: service_and_pricing_form.getValues(),
        admin_user_id: user?.id,
      };
      await createVendor(data).then(() => {
        router.refresh();
        window.location.href = "/vendor/";
      });
    }
    if (!completed_steps.includes(current_step)) {
      set_completed_steps([...completed_steps, current_step]);
    }
    if (current_step < steps.length - 1) {
      set_current_step(current_step + 1);
    } else {
    }
  };
  const StepComponent = steps[current_step].component;
  const discard = () => {
    set_is_open(false);
    set_current_step(0);
    steps.forEach((step) => step.form.reset());
  };
  const handleSubmit = async () => {};
  const handleback = () => {
    if (current_step > 0) {
      set_current_step(current_step - 1);
    }
  };
  return {
    current_step,
    set_current_step,
    is_open,
    set_is_open,
    steps,
    StepComponent,
    is_in_last_step,
    handleNextStep,
    discard,
    handleSubmit,
    completed_steps,
    business_info_form,
    operation_hours_form,
    service_and_pricing_form,
    SERVICE_TYPES,
    handleback,
    creating,
  };
};

type OnboardingContextType = ReturnType<typeof useOnboardingProvider>;
const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = useOnboardingProvider();
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
