'use client';

import { useSignIn } from '@/app/(auth)/sign-in/_services/use-mutations';
import {
  SignInSchema,
  signInDefaultValues,
  signInSchema,
} from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { ControlledInput } from '@/components/controlled-input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

/**
 * SingInForm is a React functional component that renders a sign-in form allowing users to authenticate with their email and password.
 * It integrates with a form state management library and performs form validation and submission using Zod schemas. Upon successful submission, it triggers a sign-in mutation to handle the authentication logic.
 */
export function SignInForm() {
  const { mutate: signInMutation, isPending } = useSignIn();

  const form = useForm<SignInSchema>({
    defaultValues: signInDefaultValues,
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInSchema> = (data: SignInSchema) => {
    signInMutation(data);
  };

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h2 className="mb-1 text-2xl font-semibold">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <div className="space-y-3">
          <ControlledInput<SignInSchema> name="email" label="Email" />
          <ControlledInput<SignInSchema> name="password" label="Password" type="password" />
        </div>

        <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
          {isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          Sign in
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?
          <Link href="/sign-up" className="text-primary ml-1 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
