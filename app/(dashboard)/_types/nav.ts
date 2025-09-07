import type { ComponentType } from 'react';

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  USER = 'user',
}

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
