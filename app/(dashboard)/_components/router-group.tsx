"use client";

import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";
import { motion } from "framer-motion";
import { ComponentType, useState } from "react";
import { Apple, Boxes, ChevronDown, Ruler, Utensils } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  USER = "USER",
}

interface RouteItemType {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  value: string;
}

export interface RouteGroupType {
  group: string;
  items: RouteItemType[];
  allowedRoles: Role[];
}

/**
 * Represents a collection of route groups for navigation in the application.
 *
 * Each route group specifies a categorization of related routes and includes:
 * - A group name
 * - Specific roles that are allowed access
 * - A collection of items (individual routes) within that group
 *
 * Each route item contains:
 * - The navigation path (`href`) of the route
 * - The display label for the route
 * - An optional icon associated with the route
 *
 * The `ROUTE_GROUPS` variable is used to define navigation structures and access restrictions based on user roles.
 */
export const ROUTE_GROUPS: RouteGroupType[] = [
  {
    group: "Foods Management",
    allowedRoles: [Role.ADMIN],
    items: [
      {
        href: "/admin/foods-management/foods",
        label: "Foods",
        value: "foods",
        icon: Apple,
      },
      {
        href: "/admin/foods-management/categories",
        label: "Categories",
        value: "categories",
        icon: Boxes,
      },
      {
        href: "/admin/foods-management/serving-units",
        label: "Serving Units",
        value: "serving-units",
        icon: Ruler,
      },
    ],
  },
  {
    group: "Meals Management",
    allowedRoles: [Role.ADMIN, Role.CLIENT], // Admin can also access if needed
    items: [
      {
        href: "/client",
        label: "Meals",
        value: "meals",
        icon: Utensils,
      },
    ],
  },
];

/**
 * Creates a collapsible router group with a trigger button and a list of items.
 * Toggles visibility when the trigger is activated.
 *
 * @param {Object} props - The input parameters for the RouterGroup component.
 * @param {string} props.group - The name or label of the group to be displayed.
 * @param {Array<Object>} props.items - Array of items representing the links in the group.
 * @param {string} props.items[].href - The URL for the individual route.
 * @param {string} props.items[].label - The text label for the individual route.
 * @param {React.ReactNode} props.items[].icon - The optional icon element to display alongside the route label.
 */
export function RouterGroup({ group, items }: RouteGroupType) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button
          className="text-foreground/80 flex w-full justify-between font-normal"
          variant="ghost"
        >
          {group}
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown />
          </motion.div>
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content forceMount>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          className={cn("flex flex-col gap-2", !open && "pointer-events-none")}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="link"
                asChild
                className="w-full justify-start font-normal"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-5 py-1 transition-all",
                    pathname === item.href
                      ? "bg-foreground/10 hover:bg-foreground/5"
                      : "hover:bg-foreground/10",
                  )}
                >
                  <Icon className="mr-2 size-3" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </motion.div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
