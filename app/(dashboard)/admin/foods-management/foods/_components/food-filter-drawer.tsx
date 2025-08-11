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
import { useCategories } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-queries";
import { ControlledSelect } from "@/components/controlled-select";
import { ControlledSlider } from "@/components/controlled-slider";

/**
 * FoodFilterDrawer is a component responsible for rendering a filterable, interactive drawer interface.
 * It allows users to customize food filtering options such as category, sorting, and range-based filters.
 * The component communicates with a food filters state management system, processes user input,
 * and triggers appropriate updates to the filter state.
 *
 * @return The rendered FoodFilterDrawer component.
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

        <form>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Customize your food search criteria
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                <ControlledSelect<FoodFiltersSchema>
                  label="Category"
                  name="categoryId"
                  clearable
                  options={categoriesQuery.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />

                <ControlledSelect<FoodFiltersSchema>
                  label="Sort By"
                  name="sortBy"
                  clearable
                  options={[
                    { label: "Name", value: "name" },
                    { label: "Calories", value: "calories" },
                    { label: "Carbohydrates", value: "carbohydrates" },
                    { label: "Fat", value: "fat" },
                    { label: "Protein", value: "protein" },
                  ]}
                />

                <ControlledSelect<FoodFiltersSchema>
                  label="Sort Order"
                  name="sortOrder"
                  clearable
                  options={[
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                  ]}
                />
              </div>

              <div className="flex flex-row gap-2">
                <ControlledSlider<FoodFiltersSchema>
                  name="caloriesRange"
                  label="Calories"
                  min={0}
                  max={9999}
                />
                <ControlledSlider<FoodFiltersSchema>
                  name="proteinRange"
                  label="Protein"
                  min={0}
                  max={9999}
                />
              </div>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  form.reset(foodFiltersDefaultValues);
                }}
              >
                Reset
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Apply Filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </FormProvider>
    </Drawer>
  );
}
