'use server';

import {
  MealFilterSchema,
  mealFilterSchema,
} from '@/app/(dashboard)/client/_types/meal-filter-schema';
import { MealSchema, mealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import { Prisma } from '@/generated/prisma';
import { getCurrentUser } from '@/lib/auth';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { toStringSafe } from '@/lib/utils';

/**
 * Fetches a list of meals for the authenticated user based on the provided filters.
 *
 * @param {MealFilterSchema} filters - The filters used to query meals. It may include a `dateTime`
 *                                      property to retrieve meals based on a specific date.
 * @returns promise that resolves to an array of meals. Each meal includes
 *         information about the meal itself and its associated food items.
 * @throws {Error} Throws an error if the user is not authenticated or if the filters are invalid.
 */
export const getMeals = async (filters: MealFilterSchema) => {
  return executeAction({
    actionFn: async () => {
      const session = await getCurrentUser();

      const userId = Number.parseInt(session.user.id, 10);

      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid session user ID');
      }

      const validatedFilters = mealFilterSchema.parse(filters);

      const { dateTime } = validatedFilters;

      const where: Prisma.MealWhereInput = { userId };

      if (dateTime) {
        const startDate = new Date(dateTime);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateTime);
        endDate.setHours(23, 59, 59, 999);
        where.dateTime = { gte: startDate, lte: endDate };
      }

      const meals = await prisma.meal.findMany({
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

      return meals.map((meal) => ({
        ...meal,
        userId: toStringSafe(meal.userId),
        mealFoods: meal.mealFoods.map((mealFood) => ({
          ...mealFood,
          foodId: mealFood.foodId,
          servingUnitId: mealFood.servingUnitId,
          amount: mealFood.amount,
        })),
      }));
    },
  });
};

/**
 * Retrieves a meal and its related data for the given meal ID.
 * The function ensures the user is authenticated before retrieving the meal.
 * If the meal does not exist or the user is not authenticated, an error is thrown.
 *
 * @param {number} id - The unique identifier of the meal to retrieve.
 * @returns A promise that resolves to an object representing the meal,
 * including its related meal foods, their associated food items, and serving units.
 * Each numeric property in the response is converted to a string for uniform handling.
 * @throws {Error} Throws an error if the user is not authenticated or if no meal is found with the specified ID.
 */
export const getMeal = async (id: number) => {
  return executeAction({
    actionFn: async () => {
      const session = await getCurrentUser();

      const userId = Number.parseInt(session.user.id, 10);

      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid session user ID');
      }

      const response = await prisma.meal.findFirst({
        where: { id, userId },
        include: {
          mealFoods: {
            include: {
              food: true,
              servingUnit: true,
            },
          },
        },
      });

      if (!response) throw new Error(`Meal with id ${id} not found`);

      return {
        ...response,
        userId: toStringSafe(response.userId),
        mealFoods: response.mealFoods.map((mealFood) => ({
          ...mealFood,
          foodId: mealFood.foodId,
          servingUnitId: mealFood.servingUnitId,
          amount: mealFood.amount,
        })),
      };
    },
  });
};

/**
 * Creates or updates a meal for the authenticated user.
 *
 * @param {MealSchema} data - The meal data containing action type ('create' or 'update'),
 *                            userId, dateTime, and optional mealFoods array
 * @returns A promise that resolves to the created or updated meal object
 * @throws {Error} Throws an error if the user is not authenticated or if validation fails
 */
export const saveMeal = async (data: MealSchema) => {
  return executeAction({
    actionFn: async () => {
      const session = await getCurrentUser();

      const userId = Number.parseInt(session.user.id, 10);

      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid session user ID');
      }

      const input = mealSchema.parse(data);

      if (input.action === 'create') {
        return prisma.$transaction(async (prisma) => {
          const meal = await prisma.meal.create({
            data: {
              userId,
              dateTime: input.dateTime,
            },
          });

          if (input.mealFoods && input.mealFoods.length > 0) {
            await prisma.mealFood.createMany({
              data: input.mealFoods.map((food) => ({
                mealId: meal.id,
                foodId: food.foodId,
                servingUnitId: food.servingUnitId,
                amount: food.amount,
              })),
            });
          }

          return meal;
        });
      }

      return prisma.$transaction(async (prisma) => {
        const existingMeal = await prisma.meal.findFirst({
          where: { id: input.id, userId },
        });

        if (!existingMeal) {
          throw new Error('Meal not found or unauthorized');
        }

        const meal = await prisma.meal.update({
          where: { id: input.id },
          data: { dateTime: input.dateTime },
        });

        await prisma.mealFood.deleteMany({
          where: { mealId: input.id },
        });

        if (input.mealFoods && input.mealFoods.length > 0) {
          await prisma.mealFood.createMany({
            data: input.mealFoods.map((food) => ({
              mealId: meal.id,
              foodId: food.foodId,
              servingUnitId: food.servingUnitId,
              amount: food.amount,
            })),
          });
        }

        return meal;
      });
    },
  });
};

/**
 * Deletes a meal and its associated foods from the database.
 *
 * This function executes a transactional operation to delete all food entries
 * linked to the specified meal and then deletes the meal itself. It ensures
 * that the action is performed only for authenticated users.
 *
 * @param {number} id - The unique identifier of the meal to be deleted.
 * @throws {Error} Throws an error if the user is not authenticated or if any
 * operation in the transaction fails.
 * @returns A promise that resolves to the result of the meal
 * deletion operation.
 */
export const deleteMeal = async (id: number) => {
  return executeAction({
    actionFn: async () => {
      const session = await getCurrentUser();

      const userId = Number.parseInt(session.user.id, 10);

      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid session user ID');
      }

      return prisma.$transaction(async (prisma) => {
        const existingMeal = await prisma.meal.findFirst({
          where: { id, userId },
        });

        if (!existingMeal) {
          throw new Error('Meal not found or unauthorized');
        }

        await prisma.mealFood.deleteMany({
          where: { mealId: id },
        });

        return prisma.meal.delete({
          where: { id },
        });
      });
    },
  });
};
