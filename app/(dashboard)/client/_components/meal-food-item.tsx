import { FoodWithServingUnits } from '@/app/(dashboard)/admin/foods-management/foods/_services/services';
import { MealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import { ControlledInput } from '@/components/controlled-input';
import { ControlledSelect } from '@/components/controlled-select';
import { Button } from '@/components/ui/button';
import { PaginateResult } from '@/types/paginate-result';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const MealFoodItem = ({
  index,
  onRemove,
  foodsData,
  foodOptions,
}: {
  index: number;
  onRemove: () => void;
  foodsData: PaginateResult<FoodWithServingUnits> | undefined;
  foodOptions: { label: string; value: number }[];
}) => {
  const { control } = useFormContext<MealSchema>();

  const selectedFoodId = useWatch({
    control,
    name: `mealFoods.${index}.foodId`,
  });

  const selectedFood = useMemo(
    () => foodsData?.data.find((food) => food.id === Number(selectedFoodId)),
    [foodsData, selectedFoodId],
  );

  const servingUnitOptions = useMemo(
    () =>
      selectedFood?.foodServingUnits.map((fsu) => ({
        label: fsu.servingUnit.name,
        value: fsu.servingUnit.id,
      })) ?? [],
    [selectedFood],
  );

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
      <ControlledSelect<MealSchema>
        name={`mealFoods.${index}.foodId`}
        label="Food"
        placeholder="Select a food"
        options={foodOptions}
      />

      <ControlledSelect<MealSchema>
        name={`mealFoods.${index}.servingUnitId`}
        label="Serving Unit"
        placeholder="Select a unit"
        options={servingUnitOptions}
      />

      <ControlledInput<MealSchema>
        name={`mealFoods.${index}.amount`}
        label="Amount"
        type="number"
        placeholder="0"
        min={1}
        step={1}
      />

      <Button size="icon" variant="outline" type="button" className="mt-3" onClick={onRemove}>
        <Trash2 />
      </Button>
    </div>
  );
};
