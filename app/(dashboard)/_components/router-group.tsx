'use client';

import type { RouteGroupType } from '@/app/(dashboard)/_types/nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Renders a `RouterGroup` component that groups a set of navigational items under a collapsible
 * section, with the ability to expand or collapse the group based on the current route.
 *
 * @param props - The props for the RouterGroup component.
 * @param props.group - The name of the route group to be displayed.
 * @param {Array} props.items - An array of route items, where each item represents a navigation link.
 * Each item should include `href`, `icon`, and `label` properties.
 * @return A collapsible component containing route items for navigation.
 */
export function RouterGroup({ group, items }: RouteGroupType) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => items.some((item) => pathname.startsWith(item.href)));

  useEffect(() => {
    setOpen(items.some((item) => pathname.startsWith(item.href)));
  }, [items, pathname]);

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
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          className={cn('flex flex-col gap-2', !open && 'pointer-events-none')}
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
                    'flex items-center rounded-md px-5 py-1 transition-all',
                    pathname === item.href
                      ? 'bg-foreground/10 hover:bg-foreground/5'
                      : 'hover:bg-foreground/10',
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
