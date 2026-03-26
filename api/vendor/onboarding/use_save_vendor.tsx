"use client";

import { deleteFile, replaceFile, uploadFile } from "@/api/supabase/supabase_file_upload";
import {
  TBranchDetails,
  TBranchFinances,
  TBranchInformation,
  TBusinessInformation,
  TBusinessType,
  TFinancesAndTerms,
  TOnboardingStepKey,
  TOnboardingStep,
  TOperationHours,
  TServiceAndPricing,
  TVendorServiceDraft,
  TVendorKgPricingDraft,
  TVendorItemPricingDraft,
  TVendorRoomRateDraft,
  TBranch,
  getNextOnboardingStep,
  getStepsForBusinessType,
} from "@/components/pageUIs/vendor/onboarding/onboarding_utils";
import { Tables, TablesInsert, TablesUpdate } from "@/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "../../supabase/client";

type TVendorWithLocation = Tables<"vendors"> & {
  location: Tables<"locations"> | null;
  bank_details: Tables<"bank_details"> | null;
};

export type TVendorOnboardingDraft = {
  vendor: TVendorWithLocation;
  vendorServices: TVendorServiceDraft[];
  kgPricing: TVendorKgPricingDraft[];
  itemPricing: TVendorItemPricingDraft[];
  roomRates: TVendorRoomRateDraft[];
  branches: TBranch[];
  parentBusinessName: string | null;
} | null;

type TSaveStepPayload =
  | {
    userId: string;
    step: "business_information";
    data: TBusinessInformation;
  }
  | {
    userId: string;
    step: "business_type";
    data: TBusinessType;
  }
  | {
    userId: string;
    step: "services_and_pricing";
    data: TServiceAndPricing;
  }
  | {
    userId: string;
    step: "operations_setup";
    data: TOperationHours;
  }
  | {
    userId: string;
    step: "finances_and_terms";
    data: TFinancesAndTerms;
    finalize?: boolean;
  }
  | {
    userId: string;
    step: "branch_information";
    data: TBranchInformation;
    finalize?: boolean;
  }
  | {
    userId: string;
    step: "branch_details";
    data: TBranchDetails;
  }
  | {
    userId: string;
    step: "finances";
    data: TBranchFinances;
    finalize?: boolean;
  };

const getVendorDraft = async (
  userId: string
): Promise<TVendorOnboardingDraft> => {
  const supabase = createSupabaseClient();
  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select(
      `
        *,
        location:locations(*),
        bank_details(*)
      `
    )
    .eq("admin_id", userId)
    .maybeSingle();

  if (vendorError) {
    throw vendorError;
  }

  if (!vendor) {
    return null;
  }

  const [
    { data: vendorServicesData, error: vendorServicesError },
    { data: vendorBranches, error: vendorBranchesError },
  ] = await Promise.all([
    supabase
      .from("vendor_services")
      .select("id, service_id, is_enabled")
      .eq("vendor_id", vendor.id),
    supabase
      .from("vendor_branches")
      .select(
        `
            id,
            branch_name,
            email,
            rules,
            location:locations(*)
          `
      )
      .eq("vendor_id", vendor.id),
  ]);

  if (vendorServicesError) throw vendorServicesError;
  if (vendorBranchesError) throw vendorBranchesError;

  const vendorServices: TVendorServiceDraft[] = (vendorServicesData ?? []).map(
    (vs) => ({
      vendor_service_id: vs.id,
      service_id: vs.service_id,
      is_enabled: vs.is_enabled,
    })
  );

  const vsIds = vendorServices.map((vs) => vs.vendor_service_id);

  const [
    { data: kgData, error: kgError },
    { data: itemData, error: itemError },
    { data: roomData, error: roomError },
  ] = await Promise.all([
    vsIds.length
      ? supabase
        .from("vendor_service_kg_pricing")
        .select("vendor_service_id, standard_cost_per_kg, express_cost_per_kg")
        .in("vendor_service_id", vsIds)
      : { data: [] as any[], error: null },
    vsIds.length
      ? supabase
        .from("vendor_service_item_pricing")
        .select("vendor_service_id, item_id, standard_price, express_price, item:items(name)")
        .in("vendor_service_id", vsIds)
      : { data: [] as any[], error: null },
    vsIds.length
      ? supabase
        .from("vendor_service_room_rates")
        .select("vendor_service_id, service_room_id, regular_cost, deep_cost, service_room:service_rooms(name)")
        .in("vendor_service_id", vsIds)
      : { data: [] as any[], error: null },
  ]);

  if (kgError) throw kgError;
  if (itemError) throw itemError;
  if (roomError) throw roomError;

  const kgPricing: TVendorKgPricingDraft[] = (kgData ?? []).map((kg: any) => ({
    vendor_service_id: kg.vendor_service_id,
    standard_cost_per_kg: kg.standard_cost_per_kg,
    express_cost_per_kg: kg.express_cost_per_kg,
    per_kg_weight_threshold: kg.per_kg_weight_threshold ?? null,
  }));

  const itemPricing: TVendorItemPricingDraft[] = (itemData ?? []).map(
    (ip: any) => ({
      vendor_service_id: ip.vendor_service_id,
      item_id: ip.item_id,
      item_name: ip.item?.name ?? null,
      standard_price: ip.standard_price,
      express_price: ip.express_price,
      pricing_basis_standard: ip.pricing_basis_standard ?? null,
      pricing_basis_express: ip.pricing_basis_express ?? null,
    })
  );

  const roomRates: TVendorRoomRateDraft[] = (roomData ?? []).map(
    (rr: any) => ({
      vendor_service_id: rr.vendor_service_id,
      service_room_id: rr.service_room_id,
      room_name: rr.service_room?.name ?? null,
      regular_cost: rr.regular_cost,
      deep_cost: rr.deep_cost,
    })
  );

  const branches: TBranch[] = (vendorBranches ?? []).map((b: any) => {
    const rules = b.rules && typeof b.rules === "object" ? b.rules : {};
    return {
      id: b.id,
      branch_name: b.branch_name,
      email: b.email ?? "",
      contact_person: rules.contact_person ?? "",
      contact_phone: rules.contact_phone ?? "",
      contact_email: rules.contact_email ?? "",
      location: b.location
        ? {
          place_id: b.location.place_id ?? undefined,
          description: b.location.description ?? null,
          main_text: b.location.main_text ?? undefined,
          secondary_text: b.location.secondary_text ?? undefined,
          coordinates:
            b.location.coordinates &&
              typeof b.location.coordinates === "object" &&
              "lat" in b.location.coordinates &&
              "lng" in b.location.coordinates
              ? {
                lat: Number(b.location.coordinates.lat),
                lng: Number(b.location.coordinates.lng),
              }
              : undefined,
        }
        : null,
    };
  });

  // Fetch parent business name for branch sub-vendors
  const parentBusinessName = vendor?.parent_vendor_id
    ? await fetchParentBusinessName(vendor.parent_vendor_id)
    : null;

  return {
    vendor: vendor as TVendorWithLocation,
    vendorServices,
    kgPricing,
    itemPricing,
    roomRates,
    branches,
    parentBusinessName,
  };
};

/** Fetch parent vendor's business name for branch sub-vendors */
const fetchParentBusinessName = async (
  parentVendorId: string
): Promise<string | null> => {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from("vendors")
    .select("business_name")
    .eq("id", parentVendorId)
    .maybeSingle();
  return data?.business_name ?? null;
};

const getExistingVendor = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data: vendor, error } = await supabase
    .from("vendors")
    .select(
      `
        *,
        location:locations(*),
        bank_details(*)
      `
    )
    .eq("admin_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (vendor as TVendorWithLocation | null) ?? null;
};

const ensureVendorOwnerMembership = async (userId: string, vendorId: string) => {
  const supabase = createSupabaseClient();
  const { data: membership, error: membershipError } = await supabase
    .from("vendor_users")
    .select("vendor_id")
    .eq("user_id", userId)
    .eq("vendor_id", vendorId)
    .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (!membership) {
    const ownerRecord: TablesInsert<"vendor_users"> = {
      user_id: userId,
      vendor_id: vendorId,
      role: "owner",
    };

    const { error: insertMembershipError } = await supabase
      .from("vendor_users")
      .insert(ownerRecord);

    if (insertMembershipError) {
      throw insertMembershipError;
    }
  }
};

const syncLocation = async ({
  currentLocationId,
  location,
}: {
  currentLocationId?: string | null;
  location: TBusinessInformation["location"];
}) => {
  const supabase = createSupabaseClient();

  if (!location?.coordinates) {
    return {
      locationId: null,
      address: null,
    };
  }

  const payload: TablesUpdate<"locations"> = {
    place_id: location.place_id ?? null,
    description: location.description ?? null,
    main_text: location.main_text ?? null,
    secondary_text: location.secondary_text ?? null,
    coordinates: location.coordinates,
  };

  if (currentLocationId) {
    const { data: updatedLocation, error: updateLocationError } = await supabase
      .from("locations")
      .update(payload)
      .eq("id", currentLocationId)
      .select("*")
      .single();

    if (updateLocationError) {
      throw updateLocationError;
    }

    return {
      locationId: updatedLocation.id,
      address: updatedLocation.description,
    };
  }

  const { data: insertedLocation, error: insertLocationError } = await supabase
    .from("locations")
    .insert(payload as TablesInsert<"locations">)
    .select("*")
    .single();

  if (insertLocationError) {
    throw insertLocationError;
  }

  return {
    locationId: insertedLocation.id,
    address: insertedLocation.description,
  };
};

const buildVendorAssetPath = (
  vendorId: string,
  file: File,
  filename: "logo" | "license"
) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  return `vendor-assets/${vendorId}/${filename}.${extension}`;
};

const uploadVendorLogo = async ({
  vendor,
  logo,
}: {
  vendor: Tables<"vendors">;
  logo: TBusinessInformation["logo"];
}) => {
  if (logo === null) {
    if (vendor.logo_url) {
      await deleteFile(vendor.logo_url);
    }
    return null;
  }

  if (!(logo instanceof File)) {
    return vendor.logo_url;
  }

  const assetPath = buildVendorAssetPath(vendor.id, logo, "logo");
  const uploadResult = vendor.logo_url
    ? await replaceFile({
      file: logo,
      publicUrl: vendor.logo_url,
      options: {
        bucket: "vendor-assets",
        path: assetPath,
      },
    })
    : await uploadFile(logo, {
      bucket: "vendor-assets",
      path: assetPath,
    });

  return uploadResult?.url ?? vendor.logo_url;
};

const uploadVendorLicense = async ({
  vendor,
  businessLicense,
}: {
  vendor: Tables<"vendors">;
  businessLicense: TBusinessInformation["business_license"];
}) => {
  if (!(businessLicense instanceof File)) {
    return vendor.business_license_url;
  }

  const assetPath = buildVendorAssetPath(vendor.id, businessLicense, "license");
  const uploadResult = vendor.business_license_url
    ? await replaceFile({
      file: businessLicense,
      publicUrl: vendor.business_license_url,
      options: {
        bucket: "vendor-assets",
        path: assetPath,
      },
    })
    : await uploadFile(businessLicense, {
      bucket: "vendor-assets",
      path: assetPath,
    });

  return uploadResult?.url ?? vendor.business_license_url;
};

const saveVendorServices = async ({
  vendorId,
  services,
}: {
  vendorId: string;
  services: TServiceAndPricing;
}) => {
  const supabase = createSupabaseClient();

  // Delete existing vendor_services (cascades to pricing tables via FK)
  const { error: deleteError } = await supabase
    .from("vendor_services")
    .delete()
    .eq("vendor_id", vendorId);

  if (deleteError) throw deleteError;

  const enabledServices = services.services.filter((s) => s.enabled);
  if (enabledServices.length === 0) return;

  // Insert vendor_services
  const { data: insertedServices, error: insertError } = await supabase
    .from("vendor_services")
    .insert(
      enabledServices.map((s) => ({
        vendor_id: vendorId,
        service_id: s.service_id,
        is_enabled: true,
      }))
    )
    .select("id, service_id");

  if (insertError) throw insertError;

  const serviceIdToVsId = new Map(
    (insertedServices ?? []).map((vs) => [vs.service_id, vs.id])
  );

  // Build pricing records
  const kgRecords: Array<{
    vendor_service_id: string;
    standard_cost_per_kg: number;
    express_cost_per_kg: number;
  }> = [];
  const itemRecords: Array<{
    vendor_service_id: string;
    item_id: string;
    standard_price: number;
    express_price: number;
  }> = [];
  const roomRecords: Array<{
    vendor_service_id: string;
    service_room_id: string;
    regular_cost: number;
    deep_cost: number;
  }> = [];

  enabledServices.forEach((service) => {
    const vsId = serviceIdToVsId.get(service.service_id);
    if (!vsId) return;

    if (service.service_type === "main") {
      // Per-kg pricing
      if (
        service.kg_pricing.standard_cost_per_kg > 0 ||
        service.kg_pricing.express_cost_per_kg > 0
      ) {
        kgRecords.push({
          vendor_service_id: vsId,
          standard_cost_per_kg: service.kg_pricing.standard_cost_per_kg,
          express_cost_per_kg: service.kg_pricing.express_cost_per_kg,
        });
      }

      // Per-item pricing
      service.item_pricing.forEach((item) => {
        if (item.item_id) {
          itemRecords.push({
            vendor_service_id: vsId,
            item_id: item.item_id,
            standard_price: item.standard_price,
            express_price: item.express_price,
          });
        }
      });
    } else {
      // Room rates for "other" services
      service.room_rates.forEach((rate) => {
        if (rate.service_room_id) {
          roomRecords.push({
            vendor_service_id: vsId,
            service_room_id: rate.service_room_id,
            regular_cost: rate.regular_cost,
            deep_cost: rate.deep_cost,
          });
        }
      });
    }
  });

  // Insert all pricing in parallel
  const inserts = [];
  if (kgRecords.length > 0) {
    inserts.push(
      supabase.from("vendor_service_kg_pricing").insert(kgRecords)
    );
  }
  if (itemRecords.length > 0) {
    inserts.push(
      supabase.from("vendor_service_item_pricing").insert(itemRecords)
    );
  }
  if (roomRecords.length > 0) {
    inserts.push(
      supabase.from("vendor_service_room_rates").insert(roomRecords)
    );
  }

  const results = await Promise.all(inserts);
  for (const result of results) {
    if (result.error) throw result.error;
  }
};

const updateProfileProgress = async ({
  userId,
  step,
  vendorAlreadyComplete,
  finalize,
  steps,
}: {
  userId: string;
  step: TOnboardingStepKey;
  vendorAlreadyComplete?: boolean | null;
  finalize?: boolean;
  steps?: readonly TOnboardingStep[];
}) => {
  if (vendorAlreadyComplete && !finalize) {
    return;
  }

  const supabase = createSupabaseClient();
  const nextStep = finalize ? null : getNextOnboardingStep(step, steps);
  const profileUpdate: TablesUpdate<"profiles"> = {
    signup_step: nextStep,
    updated_at: new Date().toISOString(),
  };

  if (finalize) {
    profileUpdate.profile_completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", userId);

  if (error) {
    throw error;
  }
};

const saveBusinessInformationStep = async ({
  userId,
  data,
}: {
  userId: string;
  data: TBusinessInformation;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);
  const location = await syncLocation({
    currentLocationId: existingVendor?.location_id,
    location: data.location,
  });

  let vendor: Tables<"vendors">;

  if (existingVendor) {
    const vendorUpdate: TablesUpdate<"vendors"> = {
      business_name: data.business_name,
      email: data.email,
      phone: data.phone_number,
      address: location.address,
      location_id: location.locationId,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedVendor, error: updateVendorError } = await supabase
      .from("vendors")
      .update(vendorUpdate)
      .eq("id", existingVendor.id)
      .select("*")
      .single();

    if (updateVendorError) {
      throw updateVendorError;
    }

    vendor = updatedVendor;
  } else {
    const vendorInsert: TablesInsert<"vendors"> = {
      admin_id: userId,
      business_name: data.business_name,
      email: data.email,
      phone: data.phone_number,
      address: location.address,
      location_id: location.locationId,
      profile_complete: false,
      status: "pending",
    };

    const { data: insertedVendor, error: insertVendorError } = await supabase
      .from("vendors")
      .insert(vendorInsert)
      .select("*")
      .single();

    if (insertVendorError) {
      throw insertVendorError;
    }

    vendor = insertedVendor;
  }

  await ensureVendorOwnerMembership(userId, vendor.id);

  const logoUrl = await uploadVendorLogo({
    vendor,
    logo: data.logo,
  });
  const businessLicenseUrl = await uploadVendorLicense({
    vendor,
    businessLicense: data.business_license,
  });

  const vendorAssetUpdate: TablesUpdate<"vendors"> = {};

  if (logoUrl !== vendor.logo_url) {
    vendorAssetUpdate.logo_url = logoUrl;
  }

  if (businessLicenseUrl !== vendor.business_license_url) {
    vendorAssetUpdate.business_license_url = businessLicenseUrl;
  }

  if (Object.keys(vendorAssetUpdate).length > 0) {
    const { error: vendorAssetUpdateError } = await supabase
      .from("vendors")
      .update(vendorAssetUpdate)
      .eq("id", vendor.id);

    if (vendorAssetUpdateError) {
      throw vendorAssetUpdateError;
    }
  }

  const stepsForType = existingVendor?.business_type
    ? getStepsForBusinessType(existingVendor.business_type as "individual" | "multi_branch" | "branch")
    : undefined;

  await updateProfileProgress({
    userId,
    step: "business_information",
    vendorAlreadyComplete: existingVendor?.profile_complete,
    steps: stepsForType,
  });

  return vendor.id;
};

const saveBusinessTypeStep = async ({
  userId,
  data,
}: {
  userId: string;
  data: TBusinessType;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Save business information before continuing.");
  }

  const vendorUpdate: TablesUpdate<"vendors"> = {
    business_type: data.business_type,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vendors")
    .update(vendorUpdate)
    .eq("id", existingVendor.id);

  if (error) {
    throw error;
  }

  const businessTypeSteps = getStepsForBusinessType(
    (data.business_type === "multi_branch" ? "multi_branch" : "individual") as "individual" | "multi_branch"
  );

  await updateProfileProgress({
    userId,
    step: "business_type",
    vendorAlreadyComplete: existingVendor.profile_complete,
    steps: businessTypeSteps,
  });

  return existingVendor.id;
};

const saveServicesAndPricingStep = async ({
  userId,
  data,
}: {
  userId: string;
  data: TServiceAndPricing;
}) => {
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Save business information before continuing.");
  }

  await saveVendorServices({
    vendorId: existingVendor.id,
    services: data,
  });

  const stepsForType = getStepsForBusinessType(
    (existingVendor.business_type ?? "individual") as "individual" | "multi_branch" | "branch"
  );

  await updateProfileProgress({
    userId,
    step: "services_and_pricing",
    vendorAlreadyComplete: existingVendor.profile_complete,
    steps: stepsForType,
  });

  return existingVendor.id;
};

const saveOperationsStep = async ({
  userId,
  data,
}: {
  userId: string;
  data: TOperationHours;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Save business information before continuing.");
  }

  const vendorUpdate: TablesUpdate<"vendors"> = {
    operation_hours: JSON.parse(JSON.stringify(data)),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vendors")
    .update(vendorUpdate)
    .eq("id", existingVendor.id);

  if (error) {
    throw error;
  }

  const stepsForType = getStepsForBusinessType(
    (existingVendor.business_type ?? "individual") as "individual" | "multi_branch" | "branch"
  );

  await updateProfileProgress({
    userId,
    step: "operations_setup",
    vendorAlreadyComplete: existingVendor.profile_complete,
    steps: stepsForType,
  });

  return existingVendor.id;
};

const saveFinancesStep = async ({
  userId,
  data,
  finalize,
}: {
  userId: string;
  data: TFinancesAndTerms;
  finalize?: boolean;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Save business information before continuing.");
  }

  const completedAt = finalize
    ? new Date().toISOString()
    : existingVendor.profile_completed_at;

  const vendorUpdate: TablesUpdate<"vendors"> = {
    terms_and_conditions: data.terms_and_conditions,
    profile_complete: finalize ? true : existingVendor.profile_complete,
    profile_completed_at: completedAt,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vendors")
    .update(vendorUpdate)
    .eq("id", existingVendor.id);

  if (error) {
    throw error;
  }

  const { error: bankError } = await supabase
    .from("bank_details")
    .upsert(
      {
        vendor_id: existingVendor.id,
        bank_name: data.bank_name,
        bank_account_name: data.bank_account_name,
        bank_account_number: data.bank_account_number,
      },
      { onConflict: "vendor_id" }
    );

  if (bankError) {
    throw bankError;
  }

  const stepsForType = getStepsForBusinessType(
    (existingVendor.business_type ?? "individual") as "individual" | "multi_branch" | "branch"
  );

  await updateProfileProgress({
    userId,
    step: "finances_and_terms",
    vendorAlreadyComplete: existingVendor.profile_complete,
    finalize,
    steps: stepsForType,
  });

  return existingVendor.id;
};

const saveBranchInformationStep = async ({
  userId,
  data,
  finalize,
}: {
  userId: string;
  data: TBranchInformation;
  finalize?: boolean;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Save business information before continuing.");
  }

  // Sync contact person from first branch onto the vendor record (HQ contact)
  const firstBranch = data.branches[0];
  const vendorUpdate: TablesUpdate<"vendors"> = {
    contact_person: firstBranch?.contact_person ?? null,
    contact_phone: firstBranch?.contact_phone ?? null,
    contact_email: firstBranch?.contact_email ?? null,
    profile_complete: finalize ? true : existingVendor.profile_complete,
    profile_completed_at: finalize
      ? new Date().toISOString()
      : existingVendor.profile_completed_at,
    updated_at: new Date().toISOString(),
  };

  const { error: vendorError } = await supabase
    .from("vendors")
    .update(vendorUpdate)
    .eq("id", existingVendor.id);

  if (vendorError) {
    throw vendorError;
  }

  // Delete existing branches then re-insert
  const { error: deleteError } = await supabase
    .from("vendor_branches")
    .delete()
    .eq("vendor_id", existingVendor.id);

  if (deleteError) {
    throw deleteError;
  }

  for (const branch of data.branches) {
    const locationResult = await syncLocation({
      currentLocationId: null,
      location: branch.location,
    });

    const { error: insertError } = await supabase
      .from("vendor_branches")
      .insert({
        vendor_id: existingVendor.id,
        branch_name: branch.branch_name,
        email: branch.email,
        location_id: locationResult.locationId,
        rules: {
          contact_person: branch.contact_person,
          contact_phone: branch.contact_phone,
          contact_email: branch.contact_email,
        },
      });

    if (insertError) {
      throw insertError;
    }
  }

  const multiBranchSteps = getStepsForBusinessType("multi_branch");
  await updateProfileProgress({
    userId,
    step: "branch_information",
    vendorAlreadyComplete: existingVendor.profile_complete,
    finalize,
    steps: multiBranchSteps,
  });

  // Branch invitations are now sent when the admin approves the parent
  // business, not during onboarding. See useApproveVendor.

  return existingVendor.id;
};

const saveBranchDetailsStep = async ({
  userId,
  data,
}: {
  userId: string;
  data: TBranchDetails;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Vendor record not found.");
  }

  const location = await syncLocation({
    currentLocationId: existingVendor.location_id,
    location: data.location,
  });

  const vendorUpdate: TablesUpdate<"vendors"> = {
    business_name: data.branch_name,
    address: location.address,
    location_id: location.locationId,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vendors")
    .update(vendorUpdate)
    .eq("id", existingVendor.id);

  if (error) {
    throw error;
  }

  const branchSteps = getStepsForBusinessType("branch");
  await updateProfileProgress({
    userId,
    step: "branch_details",
    vendorAlreadyComplete: existingVendor.profile_complete,
    steps: branchSteps,
  });

  return existingVendor.id;
};

const saveBranchFinancesStep = async ({
  userId,
  data,
  finalize,
}: {
  userId: string;
  data: TBranchFinances;
  finalize?: boolean;
}) => {
  const supabase = createSupabaseClient();
  const existingVendor = await getExistingVendor(userId);

  if (!existingVendor) {
    throw new Error("Vendor record not found.");
  }

  const completedAt = finalize
    ? new Date().toISOString()
    : existingVendor.profile_completed_at;

  const vendorUpdate: TablesUpdate<"vendors"> = {
    profile_complete: finalize ? true : existingVendor.profile_complete,
    profile_completed_at: completedAt,
    terms_and_conditions: data.terms_and_conditions,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vendors")
    .update(vendorUpdate)
    .eq("id", existingVendor.id);

  if (error) {
    throw error;
  }

  const { error: bankError } = await supabase
    .from("bank_details")
    .upsert(
      {
        vendor_id: existingVendor.id,
        bank_name: data.bank_name,
        bank_account_name: data.bank_account_name,
        bank_account_number: data.bank_account_number,
      },
      { onConflict: "vendor_id" }
    );

  if (bankError) {
    throw bankError;
  }

  // Mark the branch as accepted in vendor_branches
  if (finalize) {
    const parentVendorId = existingVendor.parent_vendor_id;
    if (parentVendorId) {
      await supabase
        .from("vendor_branches")
        .update({
          invitation_status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("branch_vendor_id", existingVendor.id);
    }
  }

  const branchSteps = getStepsForBusinessType("branch");
  await updateProfileProgress({
    userId,
    step: "finances",
    vendorAlreadyComplete: existingVendor.profile_complete,
    finalize,
    steps: branchSteps,
  });

  return existingVendor.id;
};

const saveOnboardingStep = async (payload: TSaveStepPayload) => {
  if (payload.step === "business_information") {
    return saveBusinessInformationStep({
      userId: payload.userId,
      data: payload.data,
    });
  }

  if (payload.step === "business_type") {
    return saveBusinessTypeStep({
      userId: payload.userId,
      data: payload.data,
    });
  }

  if (payload.step === "services_and_pricing") {
    return saveServicesAndPricingStep({
      userId: payload.userId,
      data: payload.data,
    });
  }

  if (payload.step === "operations_setup") {
    return saveOperationsStep({
      userId: payload.userId,
      data: payload.data,
    });
  }

  if (payload.step === "branch_information") {
    return saveBranchInformationStep({
      userId: payload.userId,
      data: payload.data,
      finalize: payload.finalize,
    });
  }

  if (payload.step === "branch_details") {
    return saveBranchDetailsStep({
      userId: payload.userId,
      data: payload.data,
    });
  }

  if (payload.step === "finances") {
    return saveBranchFinancesStep({
      userId: payload.userId,
      data: payload.data,
      finalize: payload.finalize,
    });
  }

  return saveFinancesStep({
    userId: payload.userId,
    data: payload.data,
    finalize: payload.finalize,
  });
};

export const useGetVendorOnboardingDraft = (userId?: string) =>
  useQuery({
    queryKey: ["vendor-onboarding-draft", userId],
    enabled: !!userId,
    queryFn: async () => getVendorDraft(userId!),
    staleTime: 30_000,
  });

export const useSaveVendorOnboardingStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveOnboardingStep,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-onboarding-draft", variables.userId],
      });
      // Only refresh user/vendor queries on finalization (last step)
      // to avoid cascading re-renders during onboarding
      if ("finalize" in variables && variables.finalize) {
        queryClient.invalidateQueries({
          queryKey: ["user", variables.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["vendor", variables.userId],
        });
      }
    },
  });
};
