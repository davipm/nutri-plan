'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTE_GROUPS } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

/**
 * A layout component that provides tab-based navigation for the foods management section.
 *
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The content to be rendered within the layout.
 * @returns The layout component with tab navigation.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /**
   * Memoized configuration for the navigation tabs, derived from ROUTE_GROUPS.
   * Filters for items in the 'Foods Management' group that have an icon.
   */
  const tabsConfig = useMemo(
    () =>
      ROUTE_GROUPS.find((group) => group.group === 'Foods Management')
        ?.items.map((item) => ({
          value: item.value,
          label: item.label,
          href: item.href,
          icon: item.icon,
        }))
        .filter((tab) => !!tab.icon) ?? [],
    [],
  );

  /**
   * Determines the active tab by matching the current pathname with the tabs' hrefs.
   * Defaults to 'foods' if no match is found.
   */
  const defaultTab = useMemo(
    () => tabsConfig.find((tab) => pathname.startsWith(tab.href))?.value || 'foods',
    [pathname, tabsConfig],
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <Tabs value={defaultTab}>
          <TabsList>
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} asChild>
                  <Link href={tab.href} className="flex items-center justify-center gap-2">
                    <Icon />
                    {tab.label}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
