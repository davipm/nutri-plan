import { Role } from '@/generated/prisma';
import type { ComponentType } from 'react';

export interface RouteItemType {
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
