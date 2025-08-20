"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { FoodFilterForm } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-filter-form";

/**
 * A drawer component for filtering foods. It includes a quick search input and a drawer
 * with more advanced filtering options.
 */
export function FoodFilterDrawer() {
  const {
    updateFoodFilters,
    foodFilters,
    foodFiltersDrawerOpen,
    updateFoodFiltersDrawerOpen,
    updateFoodFiltersSearchTerm,
  } = useFoodsStore();

  const form = useForm<FoodFiltersSchema>({
    defaultValues: foodFilters,
    resolver: zodResolver(foodFiltersSchema),
  });

  const areFiltersApplied = useMemo(
    () => !equal(foodFilters, foodFiltersDefaultValues),
    [foodFilters],
  );

  const searchTerm = useWatch({ control: form.control, name: "searchTerm" });
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    updateFoodFiltersSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateFoodFiltersSearchTerm]);

  useEffect(() => {
    if (!foodFiltersDrawerOpen) {
      form.reset(foodFilters);
    }
  }, [foodFilters, foodFiltersDrawerOpen, form]);

  const onSubmit: SubmitHandler<FoodFiltersSchema> = (data) => {
    updateFoodFilters(data);
    updateFoodFiltersDrawerOpen(false);
  };

  const handleReset = () => {
    form.reset(foodFiltersDefaultValues);
  };

  return (
    <Drawer
      open={foodFiltersDrawerOpen}
      onOpenChange={updateFoodFiltersDrawerOpen}
      direction="right"
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
              {areFiltersApplied && (
                <span className={cn(badgeVariants({ variant: "default" }))} />
              )}
            </Button>
          </DrawerTrigger>
        </div>

        <DrawerContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Customize your food search criteria.
              </DrawerDescription>
            </DrawerHeader>

            <FoodFilterForm />

            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button variant="outline" type="button" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit">Apply Filters</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </FormProvider>
    </Drawer>
  );
}
