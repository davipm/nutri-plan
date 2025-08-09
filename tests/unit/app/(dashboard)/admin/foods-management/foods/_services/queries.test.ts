import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getFoods,
  getFood,
} from "@/app/(dashboard)/admin/foods-management/foods/_services/queries";
import prisma from "@/lib/prisma";
import {
  foodFiltersDefaultValues,
  FoodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    food: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: true;
  };
}>;

const mockFoodDbResult: FoodWithServingUnits = {
  id: 1,
  name: "Apple",
  calories: 52,
  protein: 0.3,
  fat: 0.2,
  carbohydrates: 14,
  fiber: 2.4,
  sugar: 10,
  categoryId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  foodServingUnits: [
    {
      id: 101,
      foodId: 1,
      servingUnitId: 1,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      grams: new Prisma.Decimal(100),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

describe("Food Queries", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getFoods", () => {
    it("testGetFoodsWithAllFiltersAndPagination", async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        searchTerm: "Apple",
        caloriesRange: ["50", "100"],
        proteinRange: ["0", "1"],
        categoryId: "1",
        sortBy: "calories",
        sortOrder: "desc",
        page: 2,
        pageSize: 5,
      };
      const mockFoods = [mockFoodDbResult];
      const mockTotal = 1;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(mockTotal);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue(mockFoods);

      const result = await getFoods(filters);

      const expectedWhere: Prisma.FoodWhereInput = {
        name: { contains: "Apple" },
        calories: { gte: 50, lte: 100 },
        protein: { gte: 0, lte: 1 },
        category: { id: 1 },
      };
      expect(prisma.food.count).toHaveBeenCalledWith({ where: expectedWhere });
      expect(prisma.food.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: { foodServingUnits: true },
        skip: 5,
        take: 5,
        orderBy: { calories: "desc" },
      });

      expect(result).toEqual({
        data: mockFoods,
        total: mockTotal,
        page: 2,
        pageSize: 5,
        totalPages: 1,
      });
    });

    it("testGetFoodsWithDefaultParameters", async () => {
      const filters = foodFiltersDefaultValues;
      const mockFoods = [mockFoodDbResult];
      const mockTotal = 1;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(mockTotal);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue(mockFoods);

      const result = await getFoods(filters);

      const expectedWhere: Prisma.FoodWhereInput = {
        calories: { gte: 0, lte: 9999 },
        protein: { gte: 0, lte: 9999 },
      };
      expect(prisma.food.count).toHaveBeenCalledWith({ where: expectedWhere });
      expect(prisma.food.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: { foodServingUnits: true },
        skip: 0,
        take: 12,
        orderBy: { name: "desc" },
      });

      expect(result).toEqual({
        data: mockFoods,
        total: mockTotal,
        page: 1,
        pageSize: 12,
        totalPages: 1,
      });
    });

    it("testGetFoodsThrowsErrorForInvalidFilters", async () => {
      const invalidFilters = {
        ...foodFiltersDefaultValues,
        pageSize: 200, // max is 100
      };

      await expect(getFoods(invalidFilters)).rejects.toThrow(ZodError);
    });

    it("testGetFoodsReturnsEmptyResultForNoMatches", async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        searchTerm: "NonExistentFood",
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue([]);

      const result = await getFoods(filters);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
      });
    });
  });

  describe("getFood", () => {
    it("testGetFoodForExistingId", async () => {
      const foodId = 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findFirst as vi.Mock).mockResolvedValue(mockFoodDbResult);

      const result = await getFood(foodId);

      expect(prisma.food.findFirst).toHaveBeenCalledWith({
        where: { id: foodId },
        include: { foodServingUnits: true },
      });

      expect(result).toEqual({
        id: 1,
        action: "update",
        name: "Apple",
        calories: "52",
        carbohydrates: "14",
        fat: "0.2",
        fiber: "2.4",
        protein: "0.3",
        sugar: "10",
        categoryId: "1",
        foodServingUnits: [
          {
            foodServingUnitId: "1",
            grams: "100",
          },
        ],
      });
    });

    it("testGetFoodReturnsNullForNonExistentId", async () => {
      const foodId = 999;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findFirst as vi.Mock).mockResolvedValue(null);

      const result = await getFood(foodId);

      expect(prisma.food.findFirst).toHaveBeenCalledWith({
        where: { id: foodId },
        include: { foodServingUnits: true },
      });
      expect(result).toBeNull();
    });
  });
});
