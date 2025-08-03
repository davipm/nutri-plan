import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import {
  foodFiltersSchema,
  FoodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema";
import { PaginateResult } from "@/types/paginate-result";
import { FoodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { toStringSafe } from "@/lib/utils";

type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: true;
  };
}>;

/**
 * Fetches a paginated list of foods based on the provided filter criteria.
 *
 * @param {FoodFiltersSchema} filters - An object containing filter and pagination options.
 *   - `searchTerm` {string} - A string to search for matching food names.
 *   - `caloriesRange` {[string, string]} - A tuple specifying the minimum and maximum calorie values as strings.
 *   - `proteinRange` {[string, string]} - A tuple specifying the minimum and maximum protein values as strings.
 *   - `categoryId` {string | undefined} - The ID of the food category to filter by.
 *   - `sortBy` {string} - The property to sort the results by (default is "name").
 *   - `sortOrder` {'asc' | 'desc'} - The sorting order, either ascending ('asc') or descending ('desc') (default is "asc").
 *   - `page` {number} - The current page number for pagination (default is 1).
 *   - `pageSize` {number} - The number of items per page for pagination (default is 10).
 *
 * @returns {Promise<PaginateResult<FoodWithServingUnits>>} A promise that resolves to an object containing:
 *   - `data` {FoodWithServingUnits[]} - The list of foods matching the filters.
 *   - `total` {number} - The total number of foods matching the filters.
 *   - `page` {number} - The current page number.
 *   - `pageSize` {number} - The number of items per page.
 *   - `totalPages` {number} - The total number of pages based on the current filters and page size.
 */
export const getFoods = async (
  filters: FoodFiltersSchema,
): Promise<PaginateResult<FoodWithServingUnits>> => {
  const validatedFilters = foodFiltersSchema.parse(filters);

  const {
    searchTerm,
    caloriesRange = ["", ""],
    proteinRange = ["", ""],
    categoryId,
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    pageSize = 10,
  } = validatedFilters || {};

  const where: Prisma.FoodWhereInput = {};

  if (searchTerm) {
    where.name = { contains: searchTerm };
  }

  const [minCaloriesStr, maxCaloriesStr] = caloriesRange;
  const numericMinCalories =
    minCaloriesStr === "" ? undefined : Number(minCaloriesStr);
  const numericMaxCalories =
    maxCaloriesStr === "" ? undefined : Number(maxCaloriesStr);

  if (numericMinCalories !== undefined || numericMaxCalories !== undefined) {
    where.calories = {};
    if (numericMinCalories !== undefined) {
      where.calories.gte = numericMinCalories;
    }
    if (numericMaxCalories !== undefined) {
      where.calories.lte = numericMaxCalories;
    }
  }

  const [minProteinStr, maxProteinStr] = proteinRange;
  const numericMinProtein =
    minProteinStr === "" ? undefined : Number(minProteinStr);
  const numericMaxProtein =
    maxProteinStr === "" ? undefined : Number(maxProteinStr);

  if (numericMinProtein !== undefined || numericMaxProtein !== undefined) {
    where.protein = {};
    if (numericMinProtein !== undefined) {
      where.protein.gte = numericMinProtein;
    }
    if (numericMaxProtein !== undefined) {
      where.protein.lte = numericMaxProtein;
    }
  }

  const numericCategoryId = categoryId ? Number(categoryId) : undefined;
  if (numericCategoryId !== undefined && numericCategoryId !== 0) {
    where.category = { id: numericCategoryId };
  }

  const skip = (page - 1) * pageSize;

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
    action: "update" as const,
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
