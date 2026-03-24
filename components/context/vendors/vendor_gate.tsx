"use client";

import React from "react";
import { useVendor } from "./vendor_provider";
import type { Database } from "@/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type VendorRole = Database["public"]["Enums"]["vendor_user_role"]; // "owner" | "manager" | "staff"
type BusinessType = "multi_branch" | "branch" | null;

export interface VendorPermissions {
  /** Current user's role within this vendor (owner / manager / staff) */
  role: VendorRole;
  /** The vendor's business type */
  businessType: BusinessType;
  /** True when the logged-in user is the vendor owner */
  isOwner: boolean;
  /** True when the vendor is a multi-branch parent */
  isParent: boolean;
  /** True when the vendor is a branch sub-vendor */
  isBranch: boolean;
  /** Shorthand: isOwner && isParent — full branch-management access */
  canManageBranches: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns permission flags derived from the current vendor context.
 *
 * Must be called inside `<VendorProvider>`.
 */
export const useVendorRole = (): VendorPermissions => {
  const { vendor } = useVendor();

  const role = (vendor?.data?.role ?? "staff") as VendorRole;
  const businessType = (vendor?.business_type ?? null) as BusinessType;

  const isOwner = role === "owner";
  const isParent = businessType === "multi_branch";
  const isBranch = businessType === "branch";
  const canManageBranches = isOwner && isParent;

  return { role, businessType, isOwner, isParent, isBranch, canManageBranches };
};

// ─── Gate Components (Clerk-style) ───────────────────────────────────────────

interface ProtectProps {
  children: React.ReactNode;
  /** Render when the condition is NOT met (optional) */
  fallback?: React.ReactNode;
  /**
   * Allow only these roles.
   * Accepts a single role or an array.
   */
  role?: VendorRole | VendorRole[];
  /**
   * Allow only these business types.
   * Accepts a single type or an array.
   */
  businessType?: BusinessType | BusinessType[];
  /**
   * Arbitrary condition evaluated against permissions.
   * When provided, `role` and `businessType` are ignored.
   */
  condition?: (p: VendorPermissions) => boolean;
}

/**
 * Clerk-style gating component.
 *
 * @example
 * ```tsx
 * // Only owners see the button
 * <Protect role="owner">
 *   <DeleteBranchButton />
 * </Protect>
 *
 * // Only parent-vendor owners
 * <Protect condition={(p) => p.canManageBranches}>
 *   <AddBranchButton />
 * </Protect>
 *
 * // Show a read-only fallback for non-owners
 * <Protect role="owner" fallback={<ReadOnlyBadge />}>
 *   <EditButton />
 * </Protect>
 * ```
 */
export const Protect = ({
  children,
  fallback = null,
  role,
  businessType,
  condition,
}: ProtectProps) => {
  const permissions = useVendorRole();

  let allowed: boolean;

  if (condition) {
    allowed = condition(permissions);
  } else {
    const roleOk = role
      ? Array.isArray(role)
        ? role.includes(permissions.role)
        : permissions.role === role
      : true;

    const typeOk = businessType
      ? Array.isArray(businessType)
        ? businessType.includes(permissions.businessType)
        : permissions.businessType === businessType
      : true;

    allowed = roleOk && typeOk;
  }

  return <>{allowed ? children : fallback}</>;
};
