'use server';

import {
  FoodFiltersSchema,
  foodFiltersSchema,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema';
import { FoodSchema } from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import { Prisma } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { toStringSafe } from '@/lib/utils';
import { PaginateResult } from '@/types/paginate-result';

type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: true;
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
  const [total, data] = await Promise.all([
    prisma.food.count({ where }),
    prisma.food.findMany({
      where,
      include: {
        foodServingUnits: true,
      },
      skip,
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
 * @returns {Promise<FoodSchema | null>} - A promise that resolves to the food item object if found,
 * or null if no food item with the given ID exists.
 */
export const getFood = async (id: number): Promise<FoodSchema | null> => {
  const res = await prisma.food.findFirst({
    where: { id },
    include: {
      foodServingUnits: true,
    },
  });

  if (!res) return null;

  return {
    id,
    action: 'update' as const,
    name: toStringSafe(res.name),
    calories: toStringSafe(res.calories),
    carbohydrates: toStringSafe(res.carbohydrates),
    fat: toStringSafe(res.fat),
    fiber: toStringSafe(res.fiber),
    protein: toStringSafe(res.protein),
    sugar: toStringSafe(res.sugar),
    categoryId: toStringSafe(res.categoryId),
    foodServingUnits:
      res.foodServingUnits.map((unit) => ({
        foodServingUnitId: toStringSafe(unit.servingUnitId),
        grams: toStringSafe(unit.grams),
      })) ?? [],
  };
};
