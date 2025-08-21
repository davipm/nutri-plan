"use client";

import { Loader2, Loader2Icon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCategoriesStore } from "@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store";
import { FormProvider, useForm } from "react-hook-form";
import {
  categoryDefaultValues,
  categorySchema,
  CategorySchema,
} from "@/app/(dashboard)/admin/foods-management/categories/_types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategory } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-queries";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations";
import { useEffect } from "react";

type Props = {
  smallTrigger?: boolean;
};

export function CategoryFormDialog({ smallTrigger }: Props) {
  const form = useForm<CategorySchema>({
    defaultValues: categoryDefaultValues,
    resolver: zodResolver(categorySchema),
  });

  const {
    categoryDialogOpen,
    selectedCategoryId,
    updateCategoryDialogOpen,
    updateSelectedCategoryId,
  } = useCategoriesStore();

  const categoryQuery = useCategory();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const isPending =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  useEffect(() => {
    if (!!selectedCategoryId && categoryQuery.data) {
      form.reset(categoryQuery.data);
    }
  }, [categoryQuery.data, form, selectedCategoryId]);

  const handleDialogOpenChange = (open: boolean) => {
    updateCategoryDialogOpen(open);

    if (!open) {
      updateSelectedCategoryId(null);
      form.reset(categoryDefaultValues);
    }
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
            {selectedCategoryId ? "Edit Category" : "Create a New Category"}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form>
            <DialogFooter>
              <Button type="submit">
                {isPending && <Loader2Icon className="animate-spin" />}
                {!!selectedCategoryId ? "Edit" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
