"use client";

import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  singInDefaultValues,
  singInSchema,
  SingInSchema,
} from "@/app/(auth)/sing-in/_types/sing-in-schema";
import { useSingIn } from "@/app/(auth)/sing-in/_services/use-mutations";
import { ControlledInput } from "@/components/controlled-input";
import { Button } from "@/components/ui/button";

/**
 * SingInForm is a React functional component that renders a sign-in form allowing users to authenticate with their email and password.
 * It integrates with a form state management library and performs form validation and submission using Zod schemas. Upon successful submission, it triggers a sign-in mutation to handle the authentication logic.
 */
export function SingInForm() {
  const form = useForm<SingInSchema>({
    defaultValues: singInDefaultValues,
    resolver: zodResolver(singInSchema),
  });

  const singInMutation = useSingIn();

  const onSubmit: SubmitHandler<SingInSchema> = (data: SingInSchema) => {
    singInMutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <form
        className="w-full max-w-96 space-y-5 rounded-md border px-10 py-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h2 className="mb-1 text-2xl font-semibold">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-3">
          <ControlledInput<SingInSchema> name="email" label="Email" />
          <ControlledInput<SingInSchema>
            name="password"
            label="Password"
            type="password"
          />
        </div>

        <Button className="w-full" disabled={singInMutation.isPending}>
          {singInMutation.isPending && <Loader2Icon className="animate-spin" />}
          Sing in
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?
          <Link
            href="/sing-up"
            className="text-primary ml-1 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
