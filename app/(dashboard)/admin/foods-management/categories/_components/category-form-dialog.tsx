'use client';

import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useSaveCategory } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations';
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
  const { categoryDialogOpen, selectedCategoryId, setCategoryDialogOpen, setSelectedCategoryId } =
    useCategoriesStore();

  const { data: categoryToEdit } = useCategory();
  const saveCategoryMutation = useSaveCategory();

  const isPending = saveCategoryMutation.isPending;
  const isEditMode = !!selectedCategoryId;

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryDefaultValues,
  });

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      form.reset({ ...categoryToEdit, action: 'update' });
    } else if (!isEditMode) {
      form.reset(categoryDefaultValues);
    }
  }, [categoryToEdit, form, isEditMode]);

  const handleDialogOpenChange = (open: boolean) => {
    setCategoryDialogOpen(open);
    if (!open) {
      setSelectedCategoryId(null);
      form.reset(categoryDefaultValues);
    }
  };

  const onSubmit: SubmitHandler<CategorySchema> = (data) => {
    saveCategoryMutation.mutate(data, {
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
