"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TIcon } from "@/types/ui.types";
import { useVendorUI } from "./vendor_ui_provider";
import { TVendorNavItem, VENDOR_NAV_ITEMS } from "./vendor_layout_utils";
import { CaretRightIcon, SignOutIcon } from "@phosphor-icons/react";
import { useVendor } from "@/components/context/vendors/vendor_provider";

export const VendorSidebar = () => {
  const { sidebar } = useVendorUI();
  const { vendor } = useVendor();
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

    // For the root dashboard path (/vendor), require exact match
    if (link === "/vendor") {
      return pathname === "/vendor" || pathname === "/vendor/";
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
        "flex h-full w-68 flex-col gap-4 md:w-[16rem] bg-background border-r border-border",
        !isCollapsed ? "px-4" : "px-2"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 60 : 272 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className={cn("pb-1 relative", !isCollapsed ? "pt-6 px-4" : "pt-4")}>
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <h1 className="text-2xl font-semibold text-foreground font-marck">
              {vendor?.business_name}
            </h1>
          )}
        </div>
      </div>

      <nav className="flex-1">
        <ul className="flex w-full flex-col gap-1">
          {VENDOR_NAV_ITEMS.map((item) => (
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
      </nav>

      <div className="mt-auto px-2 pb-4">
        <ul>
          <li>
            <SidebarItem
              as="button"
              label="Logout"
              icon={SignOutIcon}
              collapsed={isCollapsed}
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
        "py-3 flex w-full items-center gap-3 rounded-lg px-3 text-sm hover:bg-muted transition-colors",
        isActive && "bg-foreground/5"
      )}
    >
      {Icon && <Icon className="size-5 text-foreground" />}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 text-left text-foreground"
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
          <CaretRightIcon className="size-4 text-muted-foreground" />
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
            className="overflow-hidden ml-4 border-l border-border"
          >
            {item.children.map((child) => (
              <li key={child.key}>
                <Link
                  href={child.link}
                  className={cn(
                    "block py-2 pl-4 pr-3 text-sm hover:bg-muted rounded-r-lg transition-colors",
                    pathname === child.link
                      ? "text-foreground font-medium bg-foreground/5"
                      : "text-foreground/90"
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
    "py-3",
    isActive && "bg-foreground/5",
    "flex w-full items-center gap-3 rounded-lg px-3 text-sm hover:bg-muted transition-colors text-foreground",
    className
  );

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={cn("relative", indicatorClassName)}>{children}</div>
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
        {Icon && <Icon className="size-5" />}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-foreground"
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
      {Icon && <Icon className="size-5" />}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              isActive ? "font-medium text-foreground" : "text-muted-foreground"
            )}
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
