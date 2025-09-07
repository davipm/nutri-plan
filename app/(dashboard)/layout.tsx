import { DashboardLayout } from '@/app/(dashboard)/_components/dashboard-layout';
//import { Role } from '@/app/(dashboard)/_types/nav';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');

  return <DashboardLayout>{children}</DashboardLayout>;
}
