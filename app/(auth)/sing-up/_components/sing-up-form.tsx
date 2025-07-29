"use client";

import { Loader2Icon } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  singUpDefaultValues,
  singUpSchema,
  SingUpSchema,
} from "@/app/(auth)/sing-up/_types/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSingUp } from "@/app/(auth)/sing-up/_services/use-mutations";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/controlled-input";
import Link from "next/link";

/**
 * A component that renders the sign-up form for user registration.
 *
 * This component uses React Hook Form and Zod for form validation and submission.
 * It collects user information such as full name, email, password, and confirmation password,
 * and performs the sign-up operation when the form is submitted.
 */
export function SingUpForm() {
  const signUpMutation = useSingUp();

  const form = useForm<SingUpSchema>({
    defaultValues: singUpDefaultValues,
    resolver: zodResolver(singUpSchema),
  });

  const onSubmit: SubmitHandler<SingUpSchema> = (data) => {
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
          <p className="text-muted-foreground text-sm">
            Sign up to get started
          </p>
        </div>

        <div className="space-y-3">
          <ControlledInput<SingUpSchema> name="name" label="Full Name" />
          <ControlledInput<SingUpSchema> name="email" label="Email" />
          <ControlledInput<SingUpSchema>
            name="password"
            label="Password"
            type="password"
          />
          <ControlledInput<SingUpSchema>
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
        </div>

        <Button className="w-full" disabled={signUpMutation.isPending}>
          {signUpMutation.isPending && <Loader2Icon className="animate-spin" />}
          Sing up
        </Button>

        <div className="text-center text-sm">
          Already have an account?
          <Link
            href="/sing-in"
            className="text-primary ml-1 font-medium hover:underline"
          >
            Sing in
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
