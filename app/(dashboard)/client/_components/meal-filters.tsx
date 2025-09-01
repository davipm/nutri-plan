'use client';

import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import {
  MealFilterSchema,
  mealFilterSchema,
} from '@/app/(dashboard)/client/_types/meal-filter-schema';
import { mealDefaultValues } from '@/app/(dashboard)/client/_types/meal-schema';
import { ControlledDatePicker } from '@/components/controlled-date-picker';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

export function MealFilters() {
  const { setMealFilters } = useMealStore();

  const form = useForm<MealFilterSchema>({
    defaultValues: mealDefaultValues,
    resolver: zodResolver(mealFilterSchema),
  });

  const onSubmit: SubmitHandler<MealFilterSchema> = (data) => {
    setMealFilters(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 flex items-center gap-3">
        <ControlledDatePicker<MealFilterSchema> name="dateTime" label="Filter by date" />
        <Button type="submit" size="sm">
          Apply
        </Button>
      </form>
    </FormProvider>
  );
}
