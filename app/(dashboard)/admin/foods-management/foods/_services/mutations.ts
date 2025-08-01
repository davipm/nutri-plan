import {
  foodSchema,
  FoodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { executeAction } from "@/lib/execute-action";
import prisma from "@/lib/prisma";
import { toNumberSafe } from "@/lib/utils";

export const createFood = async (data: FoodSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);
      const food = await prisma.food.create({
        data: {
          name: validatedData.name,
          calories: toNumberSafe(validatedData.calories),
          carbohydrates: toNumberSafe(validatedData.carbohydrates),
          fat: toNumberSafe(validatedData.fat),
          protein: toNumberSafe(validatedData.protein),
          categoryId: toNumberSafe(validatedData.categoryId),
          sugar: toNumberSafe(validatedData.sugar),
          fiber: toNumberSafe(validatedData.fiber),
        },
      });

      await Promise.all(
        validatedData.foodServingUnits.map(async (unit) => {
          await prisma.foodServingUnit.create({
            data: {
              foodId: food.id,
              servingUnitId: toNumberSafe(unit.foodServingUnitId),
              grams: toNumberSafe(unit.grams),
            },
          });
        }),
      );
    },
  });
};
