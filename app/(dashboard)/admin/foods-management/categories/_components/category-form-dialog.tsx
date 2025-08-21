'use client';

import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations';
import { useCategory } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-queries';
import {
  CategorySchema,
  categoryDefaultValues,
  categorySchema,
} from '@/app/(dashboard)/admin/foods-management/categories/_types/schema';
import { ControlledInput } from '@/components/controlled-input';
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
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

type Props = {
  smallTrigger?: boolean;
};

export function CategoryFormDialog({ smallTrigger }: Props) {
  const {
    categoryDialogOpen,
    selectedCategoryId,
    updateCategoryDialogOpen,
    updateSelectedCategoryId,
  } = useCategoriesStore();

  const { data: categoryToEdit } = useCategory();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const isPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;
  const isEditMode = !!selectedCategoryId;

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryDefaultValues,
  });

  useEffect(() => {
    if (categoryDialogOpen) {
      if (isEditMode && categoryToEdit) {
        form.reset(categoryToEdit);
      } else {
        form.reset(categoryDefaultValues);
      }
    }
  }, [categoryDialogOpen, isEditMode, categoryToEdit, form]);

  const handleDialogOpenChange = (open: boolean) => {
    updateCategoryDialogOpen(open);
    if (!open) {
      updateSelectedCategoryId(null);
    }
  };

  const onSubmit: SubmitHandler<CategorySchema> = (data) => {
    const mutation = data.action === 'create' ? createCategoryMutation : updateCategoryMutation;

    mutation.mutate(data, {
      onSuccess: () => handleDialogOpenChange(false),
    });
  };

  return (
    <Dialog open={categoryDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            New Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Category' : 'Create a New Category'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ControlledInput name="name" label="Name" placeholder="Enter category name" />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                <span>{isEditMode ? 'Save Changes' : 'Create Category'}</span>
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
