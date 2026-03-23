"use client";

import React, { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/context/auth_provider";
import { useFetchMainServices } from "@/api/vendor/onboarding/use_fetch_services";
import {
  useGetVendorOnboardingDraft,
  useSaveVendorOnboardingStep,
} from "@/api/vendor/onboarding/use_save_vendor";
import {
  OnboardingBusinessInformation,
  OnboardingBusinessType,
  OnboardingBranchInformation,
  OnboardingFinancesAndTerms,
  OnboardingOperationSetup,
  OnboardingServiceAndPricing,
} from "./steps";
import {
  TBranchInformation,
  TBusinessInformation,
  TBusinessType,
  TFinancesAndTerms,
  TMainService,
  TOnboardingStepKey,
  TOperationHours,
  TServiceAndPricing,
  branch_information,
  business_information,
  business_type,
  convertToServiceTypes,
  createDefaultBranchInformation,
  createDefaultFinancesAndTerms,
  createDefaultOperationHours,
  createEmptyServiceAndPricing,
  finances_and_terms,
  getCompletedStepsFromProgress,
  getOnboardingStepIndex,
  getOnboardingStepKey,
  getStepsForBusinessType,
  hydrateServiceAndPricing,
  operation_hours,
  service_and_pricing,
} from "./onboarding_utils";

const useOnboardingProvider = () => {
  const router = useRouter();
  const { user, loggedIn, loading } = useAuth();
  const [navigation_state, set_navigation_state] = useState<{
    userId: string | null;
    current_step: number;
    completed_steps: number[];
  } | null>(null);
  const [show_success, set_show_success] = useState(false);
  const { data: mainServices = [], isLoading: loadingMainServices } =
    useFetchMainServices();
  const { data: vendorDraft, isLoading: loadingVendorDraft } =
    useGetVendorOnboardingDraft(user?.id);
  const { mutateAsync: saveVendorStep, isPending: saving_step } =
    useSaveVendorOnboardingStep();

  const business_info_form = useForm<TBusinessInformation>({
    resolver: zodResolver(business_information),
    defaultValues: {
      business_name: "",
      phone_number: "",
      email: "",
      location: null,
      logo: null,
      business_license: null,
    },
  });
  const business_type_form = useForm<TBusinessType>({
    resolver: zodResolver(business_type),
    defaultValues: {
      business_type: "individual",
    },
  });
  const service_and_pricing_form = useForm<TServiceAndPricing>({
    resolver: zodResolver(service_and_pricing),
    defaultValues: createEmptyServiceAndPricing(),
  });
  const operation_hours_form = useForm<TOperationHours>({
    resolver: zodResolver(operation_hours),
    defaultValues: createDefaultOperationHours(),
  });
  const finances_and_terms_form = useForm<TFinancesAndTerms>({
    resolver: zodResolver(finances_and_terms),
    defaultValues: createDefaultFinancesAndTerms(),
  });
  const branch_information_form = useForm<TBranchInformation>({
    resolver: zodResolver(branch_information),
    defaultValues: createDefaultBranchInformation(),
  });

  const hasHydratedRef = useRef(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const SERVICE_TYPES = useMemo(
    () => convertToServiceTypes(mainServices as TMainService[]),
    [mainServices]
  );

  const selected_business_type = business_type_form.watch("business_type");

  const STEP_COMPONENT_MAP: Record<
    TOnboardingStepKey,
    { component: React.FC; form: ReturnType<typeof useForm<any>> }
  > = useMemo(
    () => ({
      business_information: {
        component: OnboardingBusinessInformation,
        form: business_info_form,
      },
      business_type: {
        component: OnboardingBusinessType,
        form: business_type_form,
      },
      services_and_pricing: {
        component: OnboardingServiceAndPricing,
        form: service_and_pricing_form,
      },
      operations_setup: {
        component: OnboardingOperationSetup,
        form: operation_hours_form,
      },
      finances_and_terms: {
        component: OnboardingFinancesAndTerms,
        form: finances_and_terms_form,
      },
      branch_information: {
        component: OnboardingBranchInformation,
        form: branch_information_form,
      },
    }),
    [
      business_info_form,
      business_type_form,
      service_and_pricing_form,
      operation_hours_form,
      finances_and_terms_form,
      branch_information_form,
    ]
  );

  const activeStepDefinitions = useMemo(
    () => getStepsForBusinessType(selected_business_type),
    [selected_business_type]
  );

  const steps = useMemo(
    () =>
      activeStepDefinitions.map((stepDef) => ({
        key: stepDef.key,
        title: stepDef.title,
        ...STEP_COMPONENT_MAP[stepDef.key],
      })),
    [activeStepDefinitions, STEP_COMPONENT_MAP]
  );

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.replace("/auth/vendor/signin");
    }
  }, [loading, loggedIn, router]);

  useEffect(() => {
    if (loading || !user || loadingMainServices || loadingVendorDraft) {
      return;
    }

    if (hasHydratedRef.current) {
      if (!initialLoadComplete) setInitialLoadComplete(true);
      return;
    }

    const vendor = vendorDraft?.vendor;
    const operationHours =
      (vendor?.operation_hours as TOperationHours | null | undefined) ?? null;

    business_info_form.reset({
      business_name: vendor?.business_name ?? "",
      phone_number: vendor?.phone ?? "",
      email: vendor?.email ?? user.email ?? "",
      location: vendor?.location
        ? {
          place_id: vendor.location.place_id ?? undefined,
          description: vendor.location.description ?? null,
          main_text: vendor.location.main_text ?? undefined,
          secondary_text: vendor.location.secondary_text ?? undefined,
          coordinates:
            vendor.location.coordinates &&
              typeof vendor.location.coordinates === "object" &&
              "lat" in vendor.location.coordinates &&
              "lng" in vendor.location.coordinates
              ? {
                lat: Number(vendor.location.coordinates.lat),
                lng: Number(vendor.location.coordinates.lng),
              }
              : undefined,
        }
        : null,
      logo: vendor?.logo_url ?? null,
      business_license: null,
    });

    business_type_form.reset({
      business_type:
        vendor?.business_type === "multi_branch"
          ? "multi_branch"
          : "individual",
    });

    service_and_pricing_form.reset(
      hydrateServiceAndPricing({
        mainServices: mainServices as TMainService[],
        enabledServices: vendorDraft?.enabledServices ?? [],
        vendorPrices: vendorDraft?.vendorPrices ?? [],
      })
    );

    operation_hours_form.reset(
      operationHours
        ? {
          ...createDefaultOperationHours(),
          ...operationHours,
        }
        : createDefaultOperationHours()
    );

    finances_and_terms_form.reset({
      payout_method: "bank_transfer",
      bank_name: vendor?.bank_name ?? "",
      bank_account_name: vendor?.bank_account_name ?? "",
      bank_account_number: vendor?.bank_account_number ?? "",
      terms_and_conditions: vendor?.terms_and_conditions ?? "",
    });

    // TODO: remove casts after running: supabase gen types typescript
    const vendorAny = vendor as any;
    branch_information_form.reset({
      branches: vendorDraft?.branches ?? [],
      contact_person: vendorAny?.contact_person ?? "",
      contact_phone: vendorAny?.contact_phone ?? "",
      contact_email: vendorAny?.contact_email ?? "",
    });

    hasHydratedRef.current = true;
    setInitialLoadComplete(true);
  }, [
    loading,
    user,
    loadingMainServices,
    loadingVendorDraft,
    vendorDraft,
    mainServices,
    business_info_form,
    business_type_form,
    service_and_pricing_form,
    operation_hours_form,
    finances_and_terms_form,
    branch_information_form,
  ]);

  const default_current_step = user
    ? getOnboardingStepIndex(user.signup_step, activeStepDefinitions)
    : 0;
  const default_completed_steps = user
    ? getCompletedStepsFromProgress(user.signup_step, false, activeStepDefinitions)
    : [];
  const profile_is_complete = vendorDraft?.vendor.profile_complete ?? false;
  const using_navigation_override =
    navigation_state?.userId === (user?.id ?? null);
  const current_step = using_navigation_override
    ? navigation_state.current_step
    : default_current_step;
  const completed_steps = using_navigation_override
    ? navigation_state.completed_steps
    : default_completed_steps;

  const updateNavigationState = ({
    nextStep,
    nextCompletedSteps,
  }: {
    nextStep?: number;
    nextCompletedSteps?: number[];
  }) => {
    set_navigation_state({
      userId: user?.id ?? null,
      current_step: nextStep ?? current_step,
      completed_steps: nextCompletedSteps ?? completed_steps,
    });
  };

  const set_current_step = (stepIndex: number) => {
    updateNavigationState({
      nextStep: stepIndex,
    });
  };

  const StepComponent =
    steps[current_step]?.component ?? OnboardingBusinessInformation;
  const is_in_last_step = current_step === steps.length - 1;
  const max_completed_step = completed_steps.length
    ? Math.max(...completed_steps)
    : -1;
  const furthest_accessible_step = profile_is_complete
    ? steps.length - 1
    : Math.min(steps.length - 1, max_completed_step + 1);

  const canNavigateToStep = (index: number) =>
    index >= 0 && index <= furthest_accessible_step;

  const markStepComplete = (stepIndex: number) => {
    updateNavigationState({
      nextCompletedSteps: completed_steps.includes(stepIndex)
        ? completed_steps
        : [...completed_steps, stepIndex].sort((a, b) => a - b),
    });
  };

  const saveStepByKey = async (
    stepKey: TOnboardingStepKey,
    finalize?: boolean
  ) => {
    if (!user?.id) {
      router.replace("/auth/vendor/signin");
      return;
    }

    if (stepKey === "business_information") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: business_info_form.getValues(),
      });
      return;
    }

    if (stepKey === "business_type") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: business_type_form.getValues(),
      });
      return;
    }

    if (stepKey === "services_and_pricing") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: service_and_pricing_form.getValues(),
        mainServices: mainServices as TMainService[],
      });
      return;
    }

    if (stepKey === "operations_setup") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: operation_hours_form.getValues(),
      });
      return;
    }

    if (stepKey === "branch_information") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: branch_information_form.getValues(),
        finalize,
      });
      return;
    }

    await saveVendorStep({
      userId: user.id,
      step: "finances_and_terms",
      data: finances_and_terms_form.getValues(),
      finalize,
    });
  };

  const handleNextStep = async () => {
    const stepKey = getOnboardingStepKey(current_step, activeStepDefinitions);
    const finalize =
      (stepKey === "finances_and_terms" || stepKey === "branch_information") &&
      !profile_is_complete;
    await saveStepByKey(stepKey, finalize);
    const updatedCompletedSteps = completed_steps.includes(current_step)
      ? completed_steps
      : [...completed_steps, current_step].sort((a, b) => a - b);

    if (!is_in_last_step) {
      updateNavigationState({
        nextStep: current_step + 1,
        nextCompletedSteps: updatedCompletedSteps,
      });
      return;
    }

    markStepComplete(current_step);
    set_show_success(true);
  };

  const handleback = () => {
    if (current_step > 0) {
      updateNavigationState({
        nextStep: current_step - 1,
      });
    }
  };

  return {
    current_step,
    set_current_step,
    steps,
    StepComponent,
    is_in_last_step,
    handleNextStep,
    completed_steps,
    business_info_form,
    business_type_form,
    service_and_pricing_form,
    operation_hours_form,
    finances_and_terms_form,
    branch_information_form,
    SERVICE_TYPES,
    handleback,
    saving_step,
    canNavigateToStep,
    existing_vendor: vendorDraft?.vendor ?? null,
    loading_page: !initialLoadComplete,
    furthest_accessible_step,
    profile_is_complete,
    show_success,
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
