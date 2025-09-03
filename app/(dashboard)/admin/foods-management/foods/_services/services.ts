'use server';

import {
  FoodFiltersSchema,
  foodFiltersSchema,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema';
import {
  FoodSchema,
  foodSchema,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import { Prisma } from '@/generated/prisma';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { toNumberSafe, toStringSafe } from '@/lib/utils';
import { PaginateResult } from '@/types/paginate-result';

export type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: {
      include: {
        servingUnit: true;
      };
    };
  };
}>;

/**
 * Fetches a paginated list of foods based on the provided filter criteria.
 */
export const getFoods = async (
  filters: FoodFiltersSchema,
): Promise<PaginateResult<FoodWithServingUnits>> => {
  const validatedFilters = foodFiltersSchema.parse(filters);

  const {
    searchTerm,
    caloriesRange = ['', ''],
    proteinRange = ['', ''],
    categoryId,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    pageSize = 10,
  } = validatedFilters;

  // Build WHERE clause
  const where = buildWhereClause({
    searchTerm,
    caloriesRange,
    proteinRange,
    categoryId,
  });

  // Calculate pagination
  const skip = (page - 1) * pageSize;

  // Execute queries in parallel
  const [total, data] = await prisma.$transaction([
    prisma.food.count({ where }),
    prisma.food.findMany({
      where,
      skip,
      include: {
        foodServingUnits: {
          include: {
            servingUnit: true,
          },
        },
      },
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

/**
 * Builds the Prisma WHERE clause for food filtering
 */
function buildWhereClause({
  searchTerm,
  caloriesRange,
  proteinRange,
  categoryId,
}: {
  searchTerm?: string;
  caloriesRange: [string, string];
  proteinRange: [string, string];
  categoryId?: string;
}): Prisma.FoodWhereInput {
  const where: Prisma.FoodWhereInput = {};

  // Search term filter
  if (searchTerm?.trim()) {
    where.name = {
      contains: searchTerm.trim(),
      // mode: "insensitive" as const,
    };
  }

  // Calorie range filter
  const calorieFilter = buildRangeFilter(caloriesRange);
  if (calorieFilter) {
    where.calories = calorieFilter;
  }

  // Protein range filter
  const proteinFilter = buildRangeFilter(proteinRange);
  if (proteinFilter) {
    where.protein = proteinFilter;
  }

  // Category filter
  const categoryFilter = buildCategoryFilter(categoryId);
  if (categoryFilter) {
    where.category = categoryFilter;
  }

  return where;
}

/**
 * Builds a numeric range filter from a string tuple
 */
function buildRangeFilter([minStr, maxStr]: [string, string]): {
  gte?: number;
  lte?: number;
} | null {
  const min = parseNumericValue(minStr);
  const max = parseNumericValue(maxStr);

  if (min === null && max === null) {
    return null;
  }

  const filter: { gte?: number; lte?: number } = {};

  if (min !== null) {
    filter.gte = min;
  }
  if (max !== null) {
    filter.lte = max;
  }

  return filter;
}

/**
 * Builds category filter from string ID
 */
function buildCategoryFilter(categoryId?: string): { id: number } | null {
  if (!categoryId?.trim()) {
    return null;
  }

  const numericCategoryId = parseNumericValue(categoryId);

  return numericCategoryId && numericCategoryId > 0 ? { id: numericCategoryId } : null;
}

/**
 * Safely parses a string to number, returning null for invalid values
 */
function parseNumericValue(value: string): number | null {
  if (!value?.trim()) {
    return null;
  }

  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/**
 * Fetches a food item and its associated serving units from the database by its unique identifier.
 *
 * @param {number} id - The unique identifier of the food item to retrieve.
 * @returns The mapped food item object to be consumed by the form.
 * @throws Error if no food item with the given ID exists.
 */
export const getFood = async (id: number) => {
  return executeAction({
    actionFn: async () => {
      const response = await prisma.food.findUnique({
        where: { id },
        include: {
          foodServingUnits: {
            include: {
              servingUnit: true,
            },
          },
        },
      });

      if (!response) throw new Error(`Food with id ${id} not found`);

      return {
        id,
        name: toStringSafe(response.name),
        calories: toStringSafe(response.calories),
        carbohydrates: toStringSafe(response.carbohydrates),
        fat: toStringSafe(response.fat),
        fiber: toStringSafe(response.fiber),
        protein: toStringSafe(response.protein),
        sugar: toStringSafe(response.sugar),
        categoryId: toStringSafe(response.categoryId),
        foodServingUnits: response.foodServingUnits.map((unit) => ({
          foodServingUnitId: toStringSafe(unit.servingUnitId),
          grams: toStringSafe(unit.grams),
        })),
      };
    },
  });
};

export const saveFood = async (data: FoodSchema) => {
  return executeAction({
    actionFn: async () => {
      const input = foodSchema.parse(data);

      if (input.action === 'create') {
        return prisma.$transaction(async (prisma) => {
          const food = await prisma.food.create({
            data: {
              name: input.name,
              calories: toNumberSafe(input.calories),
              carbohydrates: toNumberSafe(input.carbohydrates),
              fat: toNumberSafe(input.fat),
              protein: toNumberSafe(input.protein),
              categoryId: toNumberSafe(input.categoryId) || null,
              sugar: toNumberSafe(input.sugar),
              fiber: toNumberSafe(input.fiber),
            },
          });

          if (input.foodServingUnits && input.foodServingUnits.length > 0) {
            await prisma.foodServingUnit.createMany({
              data: input.foodServingUnits.map((unit) => ({
                foodId: food.id,
                servingUnitId: toNumberSafe(unit.foodServingUnitId),
                grams: toNumberSafe(unit.grams),
              })),
            });
          }

          return food;
        });
      }

      return prisma.$transaction(async (prisma) => {
        const food = await prisma.food.update({
          where: { id: input.id },
          data: {
            name: input.name,
            calories: toNumberSafe(input.calories),
            carbohydrates: toNumberSafe(input.carbohydrates),
            fat: toNumberSafe(input.fat),
            protein: toNumberSafe(input.protein),
            categoryId: toNumberSafe(input.categoryId) || null,
            sugar: toNumberSafe(input.sugar),
            fiber: toNumberSafe(input.fiber),
          },
        });

        await prisma.foodServingUnit.deleteMany({
          where: { foodId: input.id },
        });

        if (input.foodServingUnits && input.foodServingUnits.length > 0) {
          await prisma.foodServingUnit.createMany({
            data: input.foodServingUnits.map((unit) => ({
              foodId: food.id,
              servingUnitId: toNumberSafe(unit.foodServingUnitId),
              grams: toNumberSafe(unit.grams),
            })),
          });
        }

        return food;
      });
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
