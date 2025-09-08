import { SignInForm } from '@/app/(auth)/sign-in/_components/sign-in-form';
import { Role } from '@/app/(dashboard)/_types/nav';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Represents a page component that performs user authentication and role-based redirection.
 * If the user has an admin role, it redirects to the admin foods management page.
 * If the user has a regular user role, it redirects to the client page.
 * Otherwise, it renders a sign-in form.
 */
export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === Role.ADMIN) {
    redirect('/admin/foods-management/foods');
  }

  if (session?.user?.role === Role.USER) {
    redirect('/client');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
}
