'use client';

import { SpecifyMealFoods } from '@/app/(dashboard)/client/_components/specify-meal-foods';
import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { useSaveMeal } from '@/app/(dashboard)/client/_services/use-mutations';
import { useMeal } from '@/app/(dashboard)/client/_services/use-queries';
import {
  MealSchema,
  mealDefaultValues,
  mealSchema,
} from '@/app/(dashboard)/client/_types/meal-schema';
import { ControlledDatePicker } from '@/components/controlled-date-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form';

type Props = {
  smallTrigger?: boolean;
};

export function MealFormDialog({ smallTrigger }: Props) {
  const { data: session } = useSession();
  const { selectedMealId, setSelectedMealId, mealDialogOpen, setMealDialogOpen } = useMealStore();

  const isEditMode = !!selectedMealId;

  const form = useForm<MealSchema>({
    defaultValues: mealDefaultValues,
    resolver: zodResolver(mealSchema),
  });

  const userId = useWatch({ control: form.control, name: 'userId' });

  const { data: mealToEdit } = useMeal();
  const { mutate: saveMealMutation, isPending } = useSaveMeal();

  useEffect(() => {
    if (isEditMode && mealToEdit) {
      form.reset({
        ...mealToEdit,
        dateTime:
          mealToEdit.dateTime instanceof Date ? mealToEdit.dateTime : new Date(mealToEdit.dateTime),
        action: 'update',
      });
    } else if (!isEditMode) {
      form.reset(mealDefaultValues);
    }
  }, [form, isEditMode, mealToEdit]);

  useEffect(() => {
    if (!userId && session?.user?.id) {
      form.setValue('userId', session.user.id);
    }
  }, [form, session?.user?.id, userId]);

  const handleDialogOpenChange = (open: boolean) => {
    setMealDialogOpen(open);
    if (!open) {
      setSelectedMealId(null);
      form.reset(mealDefaultValues);
    }
  };

  const onSubmit: SubmitHandler<MealSchema> = (data) => {
    saveMealMutation(data, {
      onSuccess: () => handleDialogOpenChange(false),
    });
  };

  return (
    <Dialog open={mealDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            New Meal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Meal' : 'Add New Meal'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <SpecifyMealFoods />
              </div>
              <div className="col-span-2">
                <ControlledDatePicker<MealSchema> name="dateTime" label="Date" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                <span>{isEditMode ? 'Save Changes' : 'Create'}</span>
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
