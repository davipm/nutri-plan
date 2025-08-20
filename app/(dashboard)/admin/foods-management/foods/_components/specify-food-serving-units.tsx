import { CirclePlus, UtensilsCrossed } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { FoodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { useServingUnits } from "@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries";
import { Button } from "@/components/ui/button";
import { FoodServingUnitInput } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-serving-unit-input";

export function SpecifyFoodServingUnits() {
  const { control } = useFormContext<FoodSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "foodServingUnits",
  });

  const servingUnitsQuery = useServingUnits();

  const servingUnitOptions = useMemo(
    () =>
      servingUnitsQuery.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [servingUnitsQuery.data],
  );

  const handleAddServingUnit = () => {
    append({ foodServingUnitId: "", grams: "0" });
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Serving Units</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleAddServingUnit}
        >
          <CirclePlus className="size-4" /> Add Serving Unit
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
          <UtensilsCrossed className="mb-2 size-10 opacity-50" />
          <p>No serving units added yet</p>
          <p className="text-sm">
            Add serving units to help users measure this food
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <FoodServingUnitInput
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              servingUnitOptions={servingUnitOptions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
