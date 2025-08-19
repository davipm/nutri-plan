"use client";

import { Loader2Icon, Plus } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  foodDefaultValues,
  foodSchema,
  FoodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useCategories } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-queries";
import {
  useCreateFood,
  useUpdateFood,
} from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { useCategoriesStore } from "@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store";
import { useServingUnitsStore } from "@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store";
import { useEffect } from "react";
import { ControlledInput } from "@/components/controlled-input";
import { ControlledSelect } from "@/components/controlled-select";
import { CategoryFormDialog } from "@/app/(dashboard)/admin/foods-management/categories/_components/category-form-dialog";
import { SpecifyFoodServingUnits } from "@/app/(dashboard)/admin/foods-management/foods/_components/specify-food-serving-units";

export default function FoodFormDialog() {
  const form = useForm<FoodSchema>({
    defaultValues: foodDefaultValues,
    resolver: zodResolver(foodSchema),
  });

  const foodQuery = useFood();
  const categoriesQuery = useCategories();

  const createFoodMutation = useCreateFood();
  const updateFoodMutation = useUpdateFood();

  const isPending =
    createFoodMutation.isPending || updateFoodMutation.isPending;

  const {
    selectedFoodId,
    updateSelectedFoodId,
    foodDialogOpen,
    updateFoodDialogOpen,
  } = useFoodsStore();

  const { categoryDialogOpen } = useCategoriesStore();
  const { servingUnitDialogOpen } = useServingUnitsStore();

  useEffect(() => {
    if (!!selectedFoodId && foodQuery.data) {
      form.reset(foodQuery.data);
    }
  }, [foodQuery.data, form, selectedFoodId]);

  /**
   * Handles the change event for dialog open state.
   *
   * This function manages the opening and closing state of a dialog by
   * updating the dialog's state and resetting relevant form and selected
   * data when the dialog is closed.
   *
   * @param {boolean} open - The new state of the dialog (true for open, false for close).
   */
  const handleDialogOpenChange = (open: boolean) => {
    updateFoodDialogOpen(open);
    if (!open) {
      updateSelectedFoodId(null);
      form.reset(foodDefaultValues);
    }
  };

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };

  const disableSubmit = servingUnitDialogOpen || categoryDialogOpen;

  /**
   * Handle submission of food data based on the specified action type.
   *
   * This variable is a function that processes form data by mutating it
   * through appropriate mutation handlers. If the action type in the
   * submitted data is "create", a create operation is triggered; otherwise,
   * an update operation is performed. Both operations invoke a success
   * handler upon completion.
   *
   * @type {SubmitHandler<FoodSchema>}
   * @param data - The food data submitted by the form,
   * containing an action type which determines the operation ("create" or otherwise).
   */
  const onSubmit: SubmitHandler<FoodSchema> = (data) => {
    if (data.action === "create") {
      createFoodMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
    } else {
      updateFoodMutation.mutate(data, { onSuccess: handleSuccess });
    }
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
            {selectedFoodId ? "Edit Food" : "Create a New Food"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={disableSubmit ? undefined : form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 grid">
                <ControlledInput
                  name="name"
                  label="Name"
                  placeholder="Enter food name"
                />
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

              <div>
                <ControlledInput
                  name="calories"
                  label="Calories"
                  placeholder="kcal"
                />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="protein"
                  label="Protein"
                  type="number"
                  placeholder="grams"
                />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="carbohydrates"
                  label="Carbohydrates"
                  type="number"
                  placeholder="grams"
                />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="fat"
                  label="Fat"
                  type="number"
                  placeholder="grams"
                />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="fiber"
                  label="Fiber"
                  type="number"
                  placeholder="grams"
                />
              </div>

              <div>
                <ControlledInput<FoodSchema>
                  name="sugar"
                  label="Sugar"
                  type="number"
                  placeholder="grams"
                />
              </div>

              <div className="col-span-2">
                <SpecifyFoodServingUnits />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit">
              {isPending && <Loader2Icon className="animate-spin" />}
              {!!selectedFoodId ? "Edit" : "Create"} Food
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
