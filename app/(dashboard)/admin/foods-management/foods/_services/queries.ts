import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import {
  foodFiltersSchema,
  FoodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema";

type FoodWithServingUnit = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: true;
  };
}>;

export const getFoods = async (filters: FoodFiltersSchema) => {
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

export const getFood = async (id: number) => {
  const res = await prisma.food.findFirst({
    where: { id },
    include: {
      foodServingUnits: true,
    },
  });

  if (!res) return null;
};
