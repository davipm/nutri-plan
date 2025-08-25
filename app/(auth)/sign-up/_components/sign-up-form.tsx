'use client';

import { useSignUp } from '@/app/(auth)/sign-up/_services/use-mutations';
import {
  SignUpSchema,
  signUpDefaultValues,
  signUpSchema,
} from '@/app/(auth)/sign-up/_types/sign-up-schema';
import { ControlledInput } from '@/components/controlled-input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

/**
 * A component that renders the sign-up form for user registration.
 *
 * This component uses React Hook Form and Zod for form validation and submission.
 * It collects user information such as full name, email, password, and confirmation password,
 * and performs the sign-up operation when the form is submitted.
 */
export function SignUpForm() {
  const signUpMutation = useSignUp();

  const form = useForm<SignUpSchema>({
    defaultValues: signUpDefaultValues,
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    signUpMutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h2 className="mb-1 text-2xl font-semibold">Create Account</h2>
          <p className="text-muted-foreground text-sm">Sign up to get started</p>
        </div>

        <div className="space-y-3">
          <ControlledInput<SignUpSchema> name="name" label="Full Name" />
          <ControlledInput<SignUpSchema> name="email" label="Email" />
          <ControlledInput<SignUpSchema> name="password" label="Password" type="password" />
          <ControlledInput<SignUpSchema>
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
        </div>

        <Button className="w-full" disabled={signUpMutation.isPending}>
          {signUpMutation.isPending ? <Loader2Icon className="animate-spin" /> : 'Sign up'}
        </Button>

        <div className="text-center text-sm">
          Already have an account?
          <Link href="/sign-in" className="text-primary ml-1 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
