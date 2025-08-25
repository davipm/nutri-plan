'use server';

import {
  FoodSchema,
  foodSchema,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { toNumberSafe } from '@/lib/utils';

export const saveFood = async (data: FoodSchema) => {
  return executeAction({
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);

      if (validatedData.action === 'create') {
        const { foodServingUnits, ...foodData } = validatedData;
        return prisma.$transaction(async (prisma) => {
          const food = await prisma.food.create({
            data: {
              name: foodData.name,
              calories: toNumberSafe(foodData.calories),
              carbohydrates: toNumberSafe(foodData.carbohydrates),
              fat: toNumberSafe(foodData.fat),
              protein: toNumberSafe(foodData.protein),
              categoryId: toNumberSafe(foodData.categoryId) || null,
              sugar: toNumberSafe(foodData.sugar),
              fiber: toNumberSafe(foodData.fiber),
            },
          });

          if (foodServingUnits && foodServingUnits.length > 0) {
            await prisma.foodServingUnit.createMany({
              data: foodServingUnits.map((unit) => ({
                foodId: food.id,
                servingUnitId: toNumberSafe(unit.foodServingUnitId),
                grams: toNumberSafe(unit.grams),
              })),
            });
          }
          return food;
        });
      } else {
        const { id, foodServingUnits, ...restOfFoodData } = validatedData;
        return prisma.$transaction(async (prisma) => {
          const food = await prisma.food.update({
            where: { id },
            data: {
              name: restOfFoodData.name,
              calories: toNumberSafe(restOfFoodData.calories),
              carbohydrates: toNumberSafe(restOfFoodData.carbohydrates),
              fat: toNumberSafe(restOfFoodData.fat),
              protein: toNumberSafe(restOfFoodData.protein),
              categoryId: toNumberSafe(restOfFoodData.categoryId) || null,
              sugar: toNumberSafe(restOfFoodData.sugar),
              fiber: toNumberSafe(restOfFoodData.fiber),
            },
          });

          await prisma.foodServingUnit.deleteMany({
            where: { foodId: id },
          });

          if (foodServingUnits && foodServingUnits.length > 0) {
            await prisma.foodServingUnit.createMany({
              data: foodServingUnits.map((unit) => ({
                foodId: food.id,
                servingUnitId: toNumberSafe(unit.foodServingUnitId),
                grams: toNumberSafe(unit.grams),
              })),
            });
          }
          return food;
        });
      }
    },
  });
};

export const deleteFood = async (id: number) => {
  return executeAction({
    actionFn: () => {
      return prisma.$transaction(async (prisma) => {
        await prisma.foodServingUnit.deleteMany({
          where: {
            foodId: id,
          },
        });

        return prisma.food.delete({
          where: {
            id,
          },
        });
      });
    },
  });
};
