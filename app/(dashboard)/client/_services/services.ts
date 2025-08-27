'use server';

import {
  MealFilterSchema,
  mealFilterSchema,
} from '@/app/(dashboard)/client/_types/meal-filter-schema';
import { Prisma } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { toStringSafe } from '@/lib/utils';

export const getMeals = (filters: MealFilterSchema) => {
  return executeAction({
    actionFn: async () => {
      const session = await auth();
      const validatedFilters = mealFilterSchema.parse(filters);
      const { dateTime } = validatedFilters || {};
      const where: Prisma.MealWhereInput = {};

      if (dateTime !== undefined) {
        const startDate = new Date(dateTime);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateTime);
        endDate.setHours(23, 59, 59, 999);
        where.dateTime = { gte: startDate, lte: endDate };
      }

      if (session?.user.id) {
        where.userId = { equals: +session.user.id };
      }

      return await prisma.meal.findMany({
        where,
        orderBy: { dateTime: 'desc' },
        include: {
          mealFoods: {
            include: {
              food: true,
              servingUnit: true,
            },
          },
        },
      });
    },
  });
};

export const getMeal = (id: number) => {
  return executeAction({
    actionFn: async () => {
      const response = await prisma.meal.findUnique({
        where: { id },
        include: {
          mealFoods: true,
        },
      });

      if (!response) throw new Error(`Meal with id ${id} not found`);

      return {
        ...response,
        userId: toStringSafe(response.userId),
        mealFoods:
          response.mealFoods.map((mealFood) => ({
            ...mealFood,
            foodId: toStringSafe(mealFood.foodId),
            servingUnitId: toStringSafe(mealFood.servingUnitId),
            amount: toStringSafe(mealFood.amount),
          })) ?? [],
      };
    },
  });
};
