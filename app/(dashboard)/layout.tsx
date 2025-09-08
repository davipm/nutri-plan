import { DashboardLayout } from '@/app/(dashboard)/_components/dashboard-layout';
//import { Role } from '@/app/(dashboard)/_types/nav';
import { auth } from '@/lib/auth';
import { routes } from '@/lib/utils';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect(routes.signIn);

  return <DashboardLayout>{children}</DashboardLayout>;
}
