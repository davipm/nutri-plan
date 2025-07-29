import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/app/(dashboard)/_components/dashboard-layout";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/sing-in");
  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
