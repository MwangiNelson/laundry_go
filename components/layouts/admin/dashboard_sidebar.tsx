import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbTruckDelivery } from "react-icons/tb";
import { RiUserLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboardUI } from "../../context/dashboard_ui_provider";
import { TIcon } from "@/types/ui.types";
import { PiChartPieSliceFill } from "react-icons/pi";
import { RiProfileLine } from "react-icons/ri";
import {
  CaretRightIcon,
  PackageIcon,
  SignOutIcon,
  HeadsetIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

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

type TNavSection = {
  label: string;
  items: TVendorNavItem[];
};

const ADMIN_NAV_SECTIONS: TNavSection[] = [
  {
    label: "Main",
    items: [
      {
        key: "overview",
        label: "Overview",
        icon: PiChartPieSliceFill,
        link: "/dashboard",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        key: "vendors",
        label: "Vendors",
        icon: RiProfileLine,
        link: "/dashboard/vendors",
      },
      {
        key: "orders",
        label: "Orders",
        icon: PackageIcon,
        link: "/dashboard/orders",
        children: [
          {
            key: "laundry_orders",
            label: "Laundry Orders",
            link: "/dashboard/orders/laundry_orders",
          },
          {
            key: "moving_orders",
            label: "Moving Orders",
            link: "/dashboard/orders/moving_orders",
          },
          {
            key: "house_cleaning_orders",
            label: "House Cleaning Orders",
            link: "/dashboard/orders/house_cleaning_orders",
          },
          {
            key: "office_cleaning_orders",
            label: "Office Cleaning Orders",
            link: "/dashboard/orders/office_cleaning_orders",
          },
          {
            key: "fumigation_orders",
            label: "Fumigation Orders",
            link: "/dashboard/orders/fumigation_orders",
          },
        ],
      },
      {
        key: "customers",
        label: "Customers",
        link: "/dashboard/customers",
        icon: HeadsetIcon,
      },
      {
        key: "services",
        label: "Services",
        link: "/dashboard/services",
        icon: TbTruckDelivery,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        key: "transactions",
        label: "Transactions",
        icon: RiUserLine,
        link: "/dashboard/transactions",
      },
    ],
  },
];

// Flatten for backward compat
export const ADMIN_NAV_ITEMS: TVendorNavItem[] = ADMIN_NAV_SECTIONS.flatMap(
  (s) => s.items
);

export const DashboardSidebar = () => {
  const { sidebar } = useDashboardUI();
  const isCollapsed = !sidebar.isOpen;
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const toggleExpand = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isItemActive = (item: TVendorNavItem) => {
    const link = item.link ?? "";

    if (link === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }

    // For items with children, only mark as active if it's an exact match
    // This prevents parent items from being marked active when a child is active
    if (item.children && item.children.length > 0) {
      return pathname === link;
    }

    // For other paths without children, use startsWith to handle nested routes like /vendor/riders/123
    return pathname.startsWith(link);
  };

  return (
    <motion.aside
      className={cn(
        "flex h-full w-68 flex-col md:w-[16rem] bg-background border-r border-border",
        !isCollapsed ? "px-4" : "px-2"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 60 : 272 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      {/* Header with logo */}
      <div
        className={cn(
          "relative border-b border-landing-primary/15",
          !isCollapsed ? "pt-6 pb-4 px-4" : "pt-4 pb-3"
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground font-marck">
            {!isCollapsed ? "Admin" : "A"}
          </h1>
          {!isCollapsed && (
            <Image
              src="/logos/main.svg"
              alt="Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-contain"
            />
          )}
        </div>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto py-2">
        {ADMIN_NAV_SECTIONS.map((section, idx) => (
          <div key={section.label}>
            {/* Section separator */}
            {idx > 0 && (
              <div className={cn("my-2", !isCollapsed ? "mx-2" : "mx-1")}>
                <div className="h-px bg-border" />
              </div>
            )}

            {/* Section label */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1 mt-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-secondary"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>

            <ul className="flex w-full flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.key}>
                  {item.children && item.children.length > 0 ? (
                    <SidebarItemWithChildren
                      item={item}
                      isActive={isItemActive(item)}
                      collapsed={isCollapsed}
                      isExpanded={expandedItems.includes(item.key)}
                      onToggle={() => toggleExpand(item.key)}
                      pathname={pathname}
                    />
                  ) : (
                    <SidebarItem
                      as="a"
                      href={item.link ?? "#"}
                      label={item.label}
                      icon={item.icon}
                      isActive={isItemActive(item)}
                      collapsed={isCollapsed}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto border-t border-border px-2 pb-4 pt-2">
        <ul>
          <li>
            <SidebarItem
              as="button"
              label="Logout"
              icon={SignOutIcon}
              collapsed={isCollapsed}
              className="hover:!bg-destructive/10 hover:!text-destructive"
              onClick={() => {}}
            />
          </li>
        </ul>
      </div>
    </motion.aside>
  );
};

// Sidebar item with children (dropdown)
interface SidebarItemWithChildrenProps {
  item: TVendorNavItem;
  isActive: boolean;
  collapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  pathname: string;
}

const SidebarItemWithChildren = ({
  item,
  isActive,
  collapsed,
  isExpanded,
  onToggle,
  pathname,
}: SidebarItemWithChildrenProps) => {
  const Icon = item.icon;

  const buttonContent = (
    <button
      onClick={onToggle}
      className={cn(
        "py-3 flex w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors",
        isActive
          ? "bg-landing-primary/10 text-secondary font-medium"
          : "hover:bg-muted text-foreground"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-5",
            isActive ? "text-secondary" : "text-foreground"
          )}
        />
      )}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 text-left"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && (
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretRightIcon
            className={cn(
              "size-4",
              isActive ? "text-secondary/60" : "text-muted-foreground"
            )}
          />
        </motion.div>
      )}
    </button>
  );

  return (
    <div>
      {collapsed ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonContent
      )}

      {/* Children dropdown */}
      <AnimatePresence initial={false}>
        {isExpanded && !collapsed && item.children && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 border-l border-landing-primary/20"
          >
            {item.children.map((child) => (
              <li key={child.key}>
                <Link
                  href={child.link}
                  className={cn(
                    "block py-2 pl-4 pr-3 text-sm rounded-r-lg transition-colors",
                    pathname === child.link
                      ? "text-secondary font-medium bg-landing-primary/10 border-l-2 border-secondary -ml-px"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable sidebar item (polymorphic: anchor or button)
type SidebarItemBaseProps = {
  label: string;
  icon?: TIcon;
  isActive?: boolean;
  collapsed?: boolean;
  className?: string;
  indicatorClassName?: string;
};

type SidebarItemAnchorProps = SidebarItemBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: "a";
    href: string;
  };

type SidebarItemButtonProps = SidebarItemBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: undefined;
  };

type SidebarItemProps = SidebarItemAnchorProps | SidebarItemButtonProps;

const SidebarItem = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  SidebarItemProps
>(function SidebarItem(props: SidebarItemProps, ref) {
  const {
    label,
    icon,
    isActive,
    collapsed,
    className,
    indicatorClassName,
    as = "href" in props && props.href ? "a" : "button",
    ...rest
  } = props;
  const Icon = icon;
  const common = cn(
    "py-3 flex w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors",
    isActive
      ? "bg-landing-primary/10 text-secondary font-medium"
      : "hover:bg-muted text-foreground",
    className
  );

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={cn("relative", indicatorClassName)}>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-secondary" />
      )}
      {children}
    </div>
  );

  if ("href" in props && props.href && as === "a") {
    const { href, ...anchorRest } = rest as Omit<
      SidebarItemAnchorProps,
      keyof SidebarItemBaseProps
    >;
    const linkNode = (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={common}
        {...anchorRest}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-5",
              isActive ? "text-secondary" : "text-foreground"
            )}
          />
        )}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    );
    return (
      <Wrapper>
        {collapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{linkNode}</TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          linkNode
        )}
      </Wrapper>
    );
  }

  const buttonNode = (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={common}
      aria-pressed={isActive}
      {...(rest as SidebarItemButtonProps)}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-5",
            isActive ? "text-secondary" : "text-muted-foreground"
          )}
        />
      )}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
  return (
    <Wrapper>
      {collapsed ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{buttonNode}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonNode
      )}
    </Wrapper>
  );
});
