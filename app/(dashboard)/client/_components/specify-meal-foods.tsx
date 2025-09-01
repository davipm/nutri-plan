import { useFoods } from '@/app/(dashboard)/admin/foods-management/foods/_services/use-queries';
import { MealFoodItem } from '@/app/(dashboard)/client/_components/meal-food-item';
import { MealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import { Button } from '@/components/ui/button';
import { CirclePlus, UtensilsCrossed } from 'lucide-react';
import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function SpecifyMealFoods() {
  const { control } = useFormContext<MealSchema>();
  const { fields, append, remove } = useFieldArray({ control, name: 'mealFoods' });

  const { data: foodsData } = useFoods();

  const foodOptions = useMemo(
    () =>
      foodsData?.data.map((food) => ({
        label: food.name,
        value: food.id,
      })) ?? [],
    [foodsData],
  );

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
            append({
              foodId: null,
              servingUnitId: null,
              amount: 0,
            })
          }
        >
          <CirclePlus className="size-4" /> Add Food
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
          <UtensilsCrossed className="mb-2 size-10 opacity-50" />
          <p>No foods added to this meal yet</p>
          <p className="text-sm">Add foods to track what you&apos;re eating in this meal</p>
        </div>
      )}

      {fields.map((field, index) => (
        <MealFoodItem
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
          foodsData={foodsData}
          foodOptions={foodOptions}
        />
      ))}
    </div>
  );
}
