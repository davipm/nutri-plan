'use client';

import { useSignOut } from '@/app/(auth)/sign-in/_services/use-mutations';
import { RouterGroup } from '@/app/(dashboard)/_components/router-group';
import { Role } from '@/app/(dashboard)/_types/nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ROUTE_GROUPS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronLeft, LogOut, Menu } from 'lucide-react';
import { Session } from 'next-auth';
import { ReactNode, useMemo, useState } from 'react';

type Props = {
  children: ReactNode;
  session: Session;
};

/**
 * Renders the dashboard layout component, which includes a collapsible sidebar,
 * a top navigation bar, and a main content area. The layout adjusts based
 * on the user's role and supports dynamic routing for the allowed role-based
 * navigation groups.
 *
 * @param props The properties passed to the component.
 * @param props.children The content to be displayed within the main layout area.
 * @param  props.session The session object containing the user's authentication and role information.
 * @returns The rendered dashboard layout component.
 */
export function DashboardLayout({ children, session }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: signOutMutation } = useSignOut();
  const userRole = session.user?.role === Role.ADMIN ? Role.ADMIN : Role.USER;

  const filteredRouterGroup = useMemo(() => {
    return ROUTE_GROUPS.filter((group) => group.allowedRoles.includes(userRole as Role.ADMIN));
  }, [userRole]);

  const handleSignOut = () => {
    signOutMutation();
  };

  return (
    <div className="flex">
      <div className="bg-background fixed z-10 flex h-13 w-screen items-center justify-between border px-2">
        <Collapsible.Root className="h-full" open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger asChild className="m-2">
            <Button size="icon" variant="outline">
              <Menu />
            </Button>
          </Collapsible.Trigger>
        </Collapsible.Root>

        <div className="flex">
          <ThemeToggle />
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-9 items-center gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex items-center gap-3 px-2 py-1.5">
                  <Avatar className="size-10">
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-muted-foreground text-sm">{session.user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  variant="destructive"
                  className="hover:cursor-pointer"
                >
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Collapsible.Root
        className="fixed top-0 left-0 z-20 h-dvh"
        open={open}
        onOpenChange={setOpen}
      >
        <Collapsible.Content forceMount>
          <div
            className={cn(
              'bg-background fixed top-0 left-0 h-screen w-64 border p-4 transition-transform duration-300',
              open ? 'translate-x-0' : '-translate-x-full',
            )}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">
                {userRole === Role.ADMIN ? 'Admin Dashboard' : 'Dashboard'}
              </h1>
              <Collapsible.Trigger asChild>
                <Button size="icon" variant="outline">
                  <ChevronLeft />
                </Button>
              </Collapsible.Trigger>
            </div>

            <Separator className="my-2" />

            <div className="mt-4 flex flex-col">
              {filteredRouterGroup.map((group) => (
                <RouterGroup {...group} key={group.group} />
              ))}
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <main className={cn('mt-13 ml-0 flex-1 p-4 transition-all duration-300', open && 'ml-64')}>
        {children}
      </main>
    </div>
  );
}
