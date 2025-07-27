"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  singInDefaultValues,
  singInSchema,
  SingInSchema,
} from "@/app/(auth)/sing-in/_types/sing-in-schema";
import { useSingIn } from "@/app/(auth)/sing-in/_services/use-mutations";

export function SingInForm() {
  const form = useForm<SingInSchema>({
    defaultValues: singInDefaultValues,
    resolver: zodResolver(singInSchema),
  });

  const singInMutation = useSingIn();

  const onSubmit = (data: SingInSchema) => {
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

        <div className="space-y-3">{/* TODO: Inputs */}</div>
      </form>
    </FormProvider>
  );
}
