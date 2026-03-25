"use client";

import React, { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/context/auth_provider";
import { useFetchServices, useFetchParentVendorServiceIds } from "@/api/vendor/onboarding/use_fetch_services";
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
  OnboardingBranchDetails,
  OnboardingBranchFinances,
} from "./steps";
import {
  TBranchDetails,
  TBranchFinances,
  TBranchInformation,
  TBusinessInformation,
  TBusinessType,
  TFinancesAndTerms,
  TService,
  TOnboardingStepKey,
  TOperationHours,
  TServiceAndPricing,
  branch_details,
  branch_finances,
  branch_information,
  business_information,
  business_type,
  convertToServiceTypes,
  createDefaultBranchDetails,
  createDefaultBranchFinances,
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
  const queryClient = useQueryClient();
  const { user, loggedIn, loading } = useAuth();
  const [navigation_state, set_navigation_state] = useState<{
    userId: string | null;
    current_step: number;
    completed_steps: number[];
  } | null>(null);
  const { data: allServices = [], isLoading: loadingServices } =
    useFetchServices();
  const { data: vendorDraft, isLoading: loadingVendorDraft } =
    useGetVendorOnboardingDraft(user?.id);
  const parentVendorId = vendorDraft?.vendor?.parent_vendor_id ?? null;
  const { data: parentServiceIds } =
    useFetchParentVendorServiceIds(parentVendorId);
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
  const branch_details_form = useForm<TBranchDetails>({
    resolver: zodResolver(branch_details),
    defaultValues: createDefaultBranchDetails(),
  });
  const branch_finances_form = useForm<TBranchFinances>({
    resolver: zodResolver(branch_finances),
    defaultValues: createDefaultBranchFinances(),
  });

  const hasHydratedRef = useRef(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // If vendor has a parent_vendor_id it's a branch sub-vendor
  const is_branch_vendor = !!vendorDraft?.vendor?.parent_vendor_id;
  const selected_business_type = is_branch_vendor
    ? ("branch" as const)
    : business_type_form.watch("business_type");

  const SERVICE_TYPES = useMemo(() => {
    const all = convertToServiceTypes(allServices as TService[]);
    // Branch vendors only see the services their parent business selected
    if (is_branch_vendor && parentServiceIds) {
      const parentSet = new Set(parentServiceIds);
      return all.filter((s) => parentSet.has(s.id));
    }
    return all;
  }, [allServices, is_branch_vendor, parentServiceIds]);

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
      branch_details: {
        component: OnboardingBranchDetails,
        form: branch_details_form,
      },
      finances: {
        component: OnboardingBranchFinances,
        form: branch_finances_form,
      },
    }),
    [
      business_info_form,
      business_type_form,
      service_and_pricing_form,
      operation_hours_form,
      finances_and_terms_form,
      branch_information_form,
      branch_details_form,
      branch_finances_form,
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
    if (loading || !user || loadingServices || loadingVendorDraft) {
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

    // For branch vendors, only include parent-selected services and pre-enable them
    const servicesToHydrate =
      is_branch_vendor && parentServiceIds
        ? (allServices as TService[]).filter((s) =>
          parentServiceIds.includes(s.id)
        )
        : (allServices as TService[]);

    service_and_pricing_form.reset(
      hydrateServiceAndPricing({
        allServices: servicesToHydrate,
        vendorServices: vendorDraft?.vendorServices ?? [],
        kgPricing: vendorDraft?.kgPricing ?? [],
        itemPricing: vendorDraft?.itemPricing ?? [],
        roomRates: vendorDraft?.roomRates ?? [],
        forceEnabled: is_branch_vendor,
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

    const bankDetails = vendor?.bank_details;
    finances_and_terms_form.reset({
      bank_name: bankDetails?.bank_name ?? "",
      bank_account_name: bankDetails?.bank_account_name ?? "",
      bank_account_number: bankDetails?.bank_account_number ?? "",
      terms_and_conditions: vendor?.terms_and_conditions ?? "",
    });

    // Hydrate branch information for multi-branch vendors
    branch_information_form.reset({
      branches: vendorDraft?.branches ?? [],
    });

    // Hydrate branch-specific forms (for branch sub-vendors)
    if (vendor?.parent_vendor_id) {
      branch_details_form.reset({
        branch_name: vendor?.business_name ?? "",
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
      });
      branch_finances_form.reset({
        bank_name: bankDetails?.bank_name ?? "",
        bank_account_name: bankDetails?.bank_account_name ?? "",
        bank_account_number: bankDetails?.bank_account_number ?? "",
      });
    }

    hasHydratedRef.current = true;
    setInitialLoadComplete(true);
  }, [
    loading,
    user,
    loadingServices,
    loadingVendorDraft,
    vendorDraft,
    allServices,
    parentServiceIds,
    is_branch_vendor,
    business_info_form,
    business_type_form,
    service_and_pricing_form,
    operation_hours_form,
    finances_and_terms_form,
    branch_information_form,
    branch_details_form,
    branch_finances_form,
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

    if (stepKey === "branch_details") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: branch_details_form.getValues(),
      });
      return;
    }

    if (stepKey === "finances") {
      await saveVendorStep({
        userId: user.id,
        step: stepKey,
        data: branch_finances_form.getValues(),
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
      (stepKey === "finances_and_terms" || stepKey === "branch_information" || stepKey === "finances") &&
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

    // Ensure vendor query cache is refreshed with profile_complete: true
    // before navigating, to prevent VendorProvider from redirecting back
    if (finalize && user?.id) {
      await queryClient.refetchQueries({ queryKey: ["vendor", user.id] });
    }

    router.push("/vendor?onboarding=complete");
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
    branch_details_form,
    branch_finances_form,
    SERVICE_TYPES,
    handleback,
    saving_step,
    canNavigateToStep,
    existing_vendor: vendorDraft?.vendor ?? null,
    parent_business_name: (vendorDraft as any)?.parentBusinessName ?? null,
    is_branch_vendor,
    loading_page: !initialLoadComplete,
    furthest_accessible_step,
    profile_is_complete,
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
