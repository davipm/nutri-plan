import { ReactNode, useState } from "react";
import { Apple, Boxes, Ruler, Utensils } from "lucide-react";

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  USER = "USER",
}

interface RouteItemType {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface RouteGroupType {
  group: string;
  items: RouteItemType[];
  allowedRoles: Role[];
}

export const ROUTE_GROUPS: RouteGroupType[] = [
  {
    group: "Foods Management",
    allowedRoles: [Role.ADMIN],
    items: [
      {
        href: "/admin/foods-management/foods",
        label: "Foods",
        icon: <Apple className="mr-2 size-3" />,
      },
      {
        href: "/admin/foods-management/categories",
        label: "Categories",
        icon: <Boxes className="mr-2 size-3" />,
      },
      {
        href: "/admin/foods-management/serving-units",
        label: "Serving Units",
        icon: <Ruler className="mr-2 size-3" />,
      },
    ],
  },
  {
    group: "Meals Management",
    allowedRoles: [Role.ADMIN, Role.CLIENT], // Admin can also access if needed
    items: [
      {
        href: "/client/meals",
        label: "Meals",
        icon: <Utensils className="mr-2 size-3" />,
      },
    ],
  },
];

export function RouterGroup({ group, items }: RouteGroupType) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>{group} </p>
    </div>
  );
}
