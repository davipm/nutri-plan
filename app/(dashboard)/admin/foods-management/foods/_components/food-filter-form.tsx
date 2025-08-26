'use client';

import { useCategories } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-queries';
import { FoodFiltersSchema } from '@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema';
import { ControlledSelect } from '@/components/controlled-select';
import { ControlledSlider } from '@/components/controlled-slider';

const sortByOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Calories', value: 'calories' },
  { label: 'Carbohydrates', value: 'carbohydrates' },
  { label: 'Fat', value: 'fat' },
  { label: 'Protein', value: 'protein' },
];

const sortOrderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export function FoodFilterForm() {
  const categoriesQuery = useCategories();

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-wrap gap-2">
        <ControlledSelect<FoodFiltersSchema>
          label="Category"
          name="categoryId"
          clearable
          options={
            categoriesQuery.data?.map((item) => ({
              label: item.name,
              value: item.id,
            })) ?? []
          }
        />

        <ControlledSelect<FoodFiltersSchema>
          label="Sort By"
          name="sortBy"
          clearable
          options={sortByOptions}
        />

        <ControlledSelect<FoodFiltersSchema>
          label="Sort Order"
          name="sortOrder"
          clearable
          options={sortOrderOptions}
        />
      </div>

      <div className="flex flex-wrap gap-2">
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
  );
}
