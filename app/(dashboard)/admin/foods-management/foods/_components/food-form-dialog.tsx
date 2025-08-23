'use client';

import { CategoryFormDialog } from '@/app/(dashboard)/admin/foods-management/categories/_components/category-form-dialog';
import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useCategories } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-queries';
import { SpecifyFoodServingUnits } from '@/app/(dashboard)/admin/foods-management/foods/_components/specify-food-serving-units';
import { useFoodsStore } from '@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store';
import { useSaveFood } from '@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations';
import { useFood } from '@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries';
import {
  FoodSchema,
  foodDefaultValues,
  foodSchema,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { ControlledInput } from '@/components/controlled-input';
import { ControlledSelect } from '@/components/controlled-select';
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

const nutritionalFields = [
  { name: 'calories', label: 'Calories', placeholder: 'kcal', type: 'text' },
  { name: 'protein', label: 'Protein', placeholder: 'grams', type: 'number' },
  {
    name: 'carbohydrates',
    label: 'Carbohydrates',
    placeholder: 'grams',
    type: 'number',
  },
  { name: 'fat', label: 'Fat', placeholder: 'grams', type: 'number' },
  { name: 'fiber', label: 'Fiber', placeholder: 'grams', type: 'number' },
  { name: 'sugar', label: 'Sugar', placeholder: 'grams', type: 'number' },
];

export default function FoodFormDialog() {
  const form = useForm<FoodSchema>({
    defaultValues: foodDefaultValues,
    resolver: zodResolver(foodSchema),
  });

  const foodQuery = useFood();
  const categoriesQuery = useCategories();

  const saveFoodMutation = useSaveFood();

  const isPending = saveFoodMutation.isPending;

  const { selectedFoodId, updateSelectedFoodId, foodDialogOpen, updateFoodDialogOpen } =
    useFoodsStore();

  const { categoryDialogOpen } = useCategoriesStore();
  const { servingUnitDialogOpen } = useServingUnitsStore();

  useEffect(() => {
    if (selectedFoodId && foodQuery.data) {
      form.reset(foodQuery.data);
    }
  }, [foodQuery.data, form, selectedFoodId]);

  const handleDialogOpenChange = (open: boolean) => {
    updateFoodDialogOpen(open);
    if (!open) {
      updateSelectedFoodId(null);
      form.reset(foodDefaultValues);
    }
  };

  const disableSubmit = servingUnitDialogOpen || categoryDialogOpen;

  const onSubmit: SubmitHandler<FoodSchema> = (data) => {
    saveFoodMutation.mutate(data, {
      onSuccess: () => handleDialogOpenChange(false),
    });
  };

  return (
    <Dialog open={foodDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Create Food
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedFoodId ? 'Edit Food' : 'Create a New Food'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={!disableSubmit ? form.handleSubmit(onSubmit) : undefined}
          className="space-y-6"
        >
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 grid">
                <ControlledInput name="name" label="Name" placeholder="Enter food name" />
              </div>

              <div className="col-span-1 flex items-center">
                <ControlledSelect<FoodSchema>
                  name="categoryId"
                  label="Category"
                  options={categoriesQuery.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
                <CategoryFormDialog smallTrigger />
              </div>

              {nutritionalFields.map((field) => (
                <div key={field.name}>
                  <ControlledInput<FoodSchema>
                    name={field.name as keyof FoodSchema}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div className="col-span-2">
                <SpecifyFoodServingUnits />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit">
              {isPending && <Loader2Icon className="animate-spin" />}
              {selectedFoodId ? 'Edit' : 'Create'} Food
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
