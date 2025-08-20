import { CirclePlus, Trash2, UtensilsCrossed } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FoodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { useServingUnits } from "@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries";
import { Button } from "@/components/ui/button";
import { ControlledSelect } from "@/components/controlled-select";
import { ServingUnitFormDialog } from "@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-form-dialog";
import { ControlledInput } from "@/components/controlled-input";

/**
 * A function used to manage and render food serving unit fields within a form.
 * It allows users to add, edit, and remove serving units for a specific food item.
 *
 * This method uses a combination of form context, dynamic form field arrays,
 * and external data fetches to populate serving unit options.
 *
 * @return A React component containing UI elements to manage food serving units,
 * including input fields for serving unit selection and corresponding weight in grams,
 * with functionality to dynamically add or remove serving unit entries.
 */
export function SpecifyFoodServingUnits() {
  const { control } = useFormContext<FoodSchema>();

  const foodServingUnits = useFieldArray({ control, name: "foodServingUnits" });
  const servingUnitsQuery = useServingUnits();

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Serving Units</h3>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => {
            foodServingUnits.append({ foodServingUnitId: "", grams: "0" });
          }}
        >
          <CirclePlus className="size-4" /> Add Serving Unit
        </Button>
      </div>

      {foodServingUnits.fields.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center">
          <UtensilsCrossed className="mb-2 size-10 opacity-50" />
          <p>No serving units added yet</p>
          <p className="text-sm">
            Add serving units to help users measure this food
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {foodServingUnits.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_1fr_auto] items-end gap-3"
            >
              <div className="col-span-1 flex items-end">
                <ControlledSelect<FoodSchema>
                  name={`foodServingUnits.${index}.foodServingUnitId`}
                  label="Food Serving Unit"
                  placeholder="Select a serving unit..."
                  options={servingUnitsQuery.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
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

              <Button
                size="icon"
                variant="outline"
                type="button"
                onClick={() => {
                  foodServingUnits.remove(index);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
