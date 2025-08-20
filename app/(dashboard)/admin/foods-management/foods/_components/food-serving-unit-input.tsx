import { FoodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ControlledSelect } from "@/components/controlled-select";
import { ServingUnitFormDialog } from "@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-form-dialog";
import { ControlledInput } from "@/components/controlled-input";

type FoodServingUnitInputProps = {
  index: number;
  onRemove: () => void;
  servingUnitOptions: { value: number; label: string }[] | undefined;
};

/**
 * Renders a single row of inputs for a food serving unit.
 * @param index - The index of the serving unit in the field array.
 * @param onRemove - The function to call when removing a serving unit.
 * @param servingUnitOptions - The options for the serving unit select input.
 */
export function FoodServingUnitInput({
  index,
  onRemove,
  servingUnitOptions,
}: FoodServingUnitInputProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
      <div className="col-span-1 flex items-end">
        <ControlledSelect<FoodSchema>
          name={`foodServingUnits.${index}.foodServingUnitId`}
          label="Food Serving Unit"
          placeholder="Select a serving unit..."
          options={servingUnitOptions}
        />
        <ServingUnitFormDialog smallTrigger />
      </div>

      <div>
        <ControlledInput<FoodSchema>
          name={`foodServingUnits.${index}.grams`}
          label="Grams per Unit"
          type="number"
          placeholder="0"
        />
      </div>

      <Button size="icon" variant="outline" type="button" onClick={onRemove}>
        <Trash2 />
      </Button>
    </div>
  );
}
