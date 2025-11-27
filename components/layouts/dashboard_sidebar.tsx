import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
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
import { useDashboardUI } from "../context/dashboard_ui_provider";
import { TIcon } from "@/types/ui.types";
import { PiChartPieSliceFill } from "react-icons/pi";
import { RiProfileLine } from "react-icons/ri";
type NavItem = {
  key: string;
  label: string;
  icon: TIcon;
  active?: boolean;
  link?: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "overview",
    label: "Overview",
    icon: PiChartPieSliceFill,
    link: "/dashboard",
  },
  {
    key: "laundry-marts",
    label: "Laundry Marts",
    icon: RiProfileLine,
    link: "/dashboard/laundry-marts",
  },
  {
    key: "orders",
    label: "Orders",
    icon: TbTruckDelivery,
    link: "/dashboard/orders",
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: RiUserLine,
    link: "/dashboard/transactions",
  },
];

export const DashboardSidebar = () => {
  const { sidebar } = useDashboardUI();
  const isCollapsed = !sidebar.isOpen;
  const pathname = usePathname();

  return (
    <motion.aside
      className={cn(
        "flex h-full w-68 flex-col gap-4 md:w-[16rem] bg-background border-r border-border ",
        !isCollapsed ? "px-4" : "px-2"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 60 : 272 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className={cn(" pb-1 relative", !isCollapsed ? "pt-6 " : "")}>
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <h1 className="text-2xl font-semibold text-foreground font-marck ">
              Admin
            </h1>
          )}
        </div>
      </div>

      <div className="">
        <ul className="flex w-full flex-col gap-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <SidebarItem
                as="a"
                href={item.link ?? "#"}
                label={item.label}
                icon={item.icon}
                isActive={
                  item.link
                    ? item.link === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.link)
                    : false
                }
                collapsed={isCollapsed}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto px-2 pb-4 font-inter">
        <ul>
          <li>
            <SidebarItem
              as="button"
              label="Logout"
              icon={IoLogOutOutline}
              collapsed={isCollapsed}
              onClick={() => {}}
            />
          </li>
        </ul>
      </div>
    </motion.aside>
  );
};

// Reusable sidebar item (polymorphic: anchor or button) kept in this file as requested
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
    "py-4",
    isActive && "bg-foreground/5",
    "flex w-full items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted transition-colors text-foreground",
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
    const Icon = icon;
    const linkNode = (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={common}
        {...anchorRest}
      >
        {Icon ? (
          <Icon
            className={cn(
              "size-6",

              collapsed && "size-6"
            )}
          />
        ) : null}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className={cn("text-foreground")}
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
      {Icon ? (
        <Icon
          className={cn(
            "size-5",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        />
      ) : null}
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
