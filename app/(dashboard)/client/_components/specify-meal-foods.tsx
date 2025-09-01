'use client';

import { useFoods } from '@/app/(dashboard)/admin/foods-management/foods/_services/use-queries';
import { useServingUnits } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import { MealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import { ControlledInput } from '@/components/controlled-input';
import { ControlledSelect } from '@/components/controlled-select';
import { Button } from '@/components/ui/button';
import { CirclePlus, Trash2, UtensilsCrossed } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function SpecifyMealFoods() {
  const { control } = useFormContext<MealSchema>();
  const mealsFoods = useFieldArray({ control, name: 'mealFoods' });

  const { data: foods } = useFoods();
  const { data: servingUnit = [] } = useServingUnits();

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Foods</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() =>
            mealsFoods.append({
              foodId: null,
              servingUnitId: null,
              amount: 0,
            })
          }
        >
          <CirclePlus className="size-4" /> Add Food
        </Button>
      </div>

      {mealsFoods.fields.length === 0 && (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
          <UtensilsCrossed className="mb-2 size-10 opacity-50" />
          <p>No foods added to this meal yet</p>
          <p className="text-sm">Add foods to track what you&apos;re eating in this meal</p>
        </div>
      )}

      {mealsFoods.fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
          <ControlledSelect<MealSchema>
            name={`mealFoods.${index}.foodId`}
            label="Food"
            placeholder="Select a food"
            options={foods?.data.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <ControlledSelect<MealSchema>
            name={`mealFoods.${index}.servingUnitId`}
            label="Serving Unit"
            placeholder="Select a unit"
            options={servingUnit.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />

          <ControlledInput<MealSchema>
            name={`mealFoods.${index}.amount`}
            label="Amount"
            type="number"
            placeholder="0"
          />

          <Button
            size="icon"
            variant="outline"
            type="button"
            className="mt-3"
            onClick={() => mealsFoods.remove(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}
