"use client";

import { ReactNode, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Session } from "next-auth";
import { useSingOut } from "@/app/(auth)/sing-in/_services/use-mutations";
import {
  ROUTE_GROUPS,
  Role,
  RouterGroup,
} from "@/app/(dashboard)/_components/router-group";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: ReactNode;
  session: Session;
};

/**
 * DashboardLayout component that provides the main structure of the dashboard,
 * including navigation, theme toggling, and user session management.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - Child components to render within the layout.
 * @param {Object} props.session - The session object which contains user data.
 * @param {Object} [props.session.user] - The user information within the session.
 * @param {string} [props.session.user.name] - The name of the user.
 * @param {string} [props.session.user.email] - The email of the user.
 */
export function DashboardLayout({ children, session }: Props) {
  const [open, setOpen] = useState(false);
  const signOutMutation = useSingOut();
  const userRole: Role = (session.user?.role as Role) || Role.USER;

  /**
   * Filters route groups based on the user's role.
   *
   * The `getFilteredRouteGroups` variable contains the result of filtering the `ROUTE_GROUPS` array.
   * Each group is included in the filtered result if the `allowedRoles` of the group includes the specified `userRole`.
   *
   * @constant {Array} getFilteredRouteGroups - The array of route groups filtered based on the user's role.
   */
  const getFilteredRouteGroups = ROUTE_GROUPS.filter((group) =>
    group.allowedRoles.includes(userRole),
  );

  const handleSignOut = () => {
    signOutMutation.mutate();
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
                <Button
                  variant="ghost"
                  className="flex h-9 items-center gap-2 px-2"
                >
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
                    <p className="text-muted-foreground text-sm">
                      {session.user?.email}
                    </p>
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
              "bg-background fixed top-0 left-0 h-screen w-64 border p-4 transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Admin Dashboard</h1>
              <Collapsible.Trigger asChild>
                <Button size="icon" variant="outline">
                  <ChevronLeft />
                </Button>
              </Collapsible.Trigger>
            </div>

            <Separator className="my-2" />

            <div className="mt-4 flex flex-col">
              {getFilteredRouteGroups.map((group) => (
                <RouterGroup {...group} key={group.group} />
              ))}
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <main
        className={cn(
          "mt-13 ml-0 flex-1 p-4 transition-all duration-300",
          open && "ml-64",
        )}
      >
        {children}
      </main>
    </div>
  );
}
