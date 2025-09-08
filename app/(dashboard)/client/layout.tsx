//import { Role } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { routes } from '@/lib/utils';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect(routes.signIn);

  //if (session.user?.role === Role.ADMIN) redirect('/admin/foods-management/foods');
  return <div className="mx-auto max-w-7xl p-6">{children}</div>;
}
