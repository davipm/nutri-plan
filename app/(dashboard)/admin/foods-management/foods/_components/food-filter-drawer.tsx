"use client";

import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { ControlledInput } from "@/components/controlled-input";
import {
  foodFiltersDefaultValues,
  foodFiltersSchema,
  FoodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import equal from "fast-deep-equal";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { useEffect, useMemo } from "react";
import { FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { useDebounce } from "@/lib/use-debounce";
import { useCategories } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-queries";

// TODO: finish this
export function FoodFilterDrawer() {
  const {
    updateFoodFilters,
    foodFilters,
    updateFoodFilterPage,
    foodFiltersDrawerOpen,
    updateFoodDialogOpen,
    updateFoodFiltersDrawerOpen,
    updateFoodFiltersSearchTerm,
  } = useFoodsStore();

  const form = useForm<FoodFiltersSchema>({
    defaultValues: foodFiltersDefaultValues,
    resolver: zodResolver(foodFiltersSchema),
  });

  const areFieldModified = useMemo(() => {
    return !equal(foodFilters, foodFiltersDefaultValues);
  }, [foodFilters]);

  const searchTerm = useWatch({ control: form.control, name: "searchTerm" });
  const debounceSearchTerm = useDebounce(searchTerm, 400);
  const categoriesQuery = useCategories();

  const onSubmit: SubmitHandler<FoodFiltersSchema> = (data) => {
    updateFoodFilters(data);
    updateFoodFiltersDrawerOpen(false);
  };

  useEffect(() => {
    updateFoodFiltersSearchTerm(debounceSearchTerm);
  }, [debounceSearchTerm, updateFoodFiltersSearchTerm]);

  useEffect(() => {
    if (!foodFiltersDrawerOpen) {
      form.reset(foodFilters);
    }
  }, [foodFilters, foodFiltersDrawerOpen, form]);

  return (
    <Drawer
      open={foodFiltersDrawerOpen}
      onOpenChange={updateFoodFiltersDrawerOpen}
      direction="right"
      handleOnly
    >
      <FormProvider {...form}>
        <div className="flex gap-2">
          <ControlledInput<FoodFiltersSchema>
            name="searchTerm"
            placeholder="Quick Search"
            containerClassName="max-w-48"
          />
          <DrawerTrigger asChild>
            <Button variant="outline">
              <FilterIcon />
              Filters
              {areFieldModified && (
                <span className={cn(badgeVariants({ variant: "default" }))} />
              )}
            </Button>
          </DrawerTrigger>
        </div>
      </FormProvider>
    </Drawer>
  );
}
