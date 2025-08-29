import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await auth();
  if (!session) redirect('/sign-in');
  return <div className="mx-auto max-w-7xl p-6">{children}</div>;
}
