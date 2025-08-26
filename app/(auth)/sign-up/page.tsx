import { SignUpForm } from '@/app/(auth)/sign-up/_components/sign-up-form';
import { Role } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Represents the Page component which handles user authentication and redirection
 * based on the user's role.
 *
 * Redirects the user to the admin or client dashboard if they are authenticated
 * and possess the corresponding role. If the user is not authenticated or has
 * no role, renders the signup form.
 *
 * when no redirection occurs. Otherwise, performs a redirection and returns null.
 */
export default async function Page() {
  const session = await auth();

  if (session?.user?.role === Role.ADMIN) {
    redirect('/admin/foods-management/foods');
  }

  if (session?.user?.role === Role.USER) {
    redirect('/client');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUpForm />
    </div>
  );
}
