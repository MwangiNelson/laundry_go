import { TIcon } from "@/types/ui.types";
import {
  SquaresFourIcon,
  PackageIcon,
  BroomIcon,
  BicycleIcon,
  ClockCounterClockwiseIcon,
  GearIcon,
  SignOutIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

export type TVendorNavItemChild = {
  key: string;
  label: string;
  link: string;
};
export type TVendorNavItem = {
  key: string;
  label: string;
  icon: TIcon;
  active?: boolean;
  link?: string;
  children?: TVendorNavItemChild[];
};

export const VENDOR_NAV_ITEMS: TVendorNavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: SquaresFourIcon,
    link: "/vendor",
  },
  {
    key: "orders",
    label: "Orders",
    icon: PackageIcon,
    link: "/vendor/orders",
  },
  {
    key: "services",
    label: "Services",
    icon: BroomIcon,
    link: "/vendor/services",
  },
  {
    key: "riders",
    label: "Riders",
    icon: BicycleIcon,
    link: "/vendor/riders",
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: ClockCounterClockwiseIcon,
    link: "/vendor/transactions",
  },
  {
    key: "settings",
    label: "Settings",
    icon: GearIcon,
    link: "/vendor/settings",
  },
];
