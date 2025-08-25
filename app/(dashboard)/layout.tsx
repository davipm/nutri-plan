import { DashboardLayout } from '@/app/(dashboard)/_components/dashboard-layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect('/sign-in');
  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
