import {
  deleteFood,
  getFood,
  getFoods,
  saveFood,
} from '@/app/(dashboard)/admin/foods-management/foods/_services/services';
import {
  FoodFiltersSchema,
  foodFiltersDefaultValues,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema';
import { FoodSchema } from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import { Prisma } from '@/generated/prisma';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { toNumberSafe, toStringSafe } from '@/lib/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

vi.mock('@/lib/prisma', () => ({
  default: {
    food: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    foodServingUnit: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/execute-action', () => ({
  executeAction: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  toNumberSafe: vi.fn(),
  toStringSafe: vi.fn(),
}));

vi.mock('@/app/(dashboard)/admin/foods-management/foods/_types/food-schema', () => ({
  foodSchema: {
    parse: vi.fn(),
  },
}));

// Mock next-auth to avoid AuthError issues
vi.mock('next-auth', () => ({
  AuthError: class AuthError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthError';
    }
  },
}));

// Mock next/dist/client/components/redirect-error
vi.mock('next/dist/client/components/redirect-error', () => ({
  isRedirectError: vi.fn(() => false),
}));

type FoodWithServingUnits = Prisma.FoodGetPayload<{
  include: {
    foodServingUnits: true;
  };
}>;

const mockFoodDbResult: FoodWithServingUnits = {
  id: 1,
  name: 'Apple',
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

describe('Food Queries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getFoods', () => {
    beforeEach(() => {
      // Mock $transaction to resolve the array of actions passed to it
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.$transaction as vi.Mock).mockImplementation(async (actions: never[]) => {
        return await Promise.all(actions);
      });
    });

    it('testGetFoodsWithAllFiltersAndPagination', async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        searchTerm: 'Apple',
        caloriesRange: ['50', '100'],
        proteinRange: ['0', '1'],
        categoryId: '1',
        sortBy: 'calories',
        sortOrder: 'desc',
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
        name: { contains: 'Apple' },
        calories: { gte: 50, lte: 100 },
        protein: { gte: 0, lte: 1 },
        category: { id: 1 },
      };
      expect(prisma.food.count).toHaveBeenCalledWith({ where: expectedWhere });
      expect(prisma.food.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        include: { foodServingUnits: { include: { servingUnit: true } } },
        skip: 5,
        take: 5,
        orderBy: { calories: 'desc' },
      });

      expect(result).toEqual({
        data: mockFoods,
        total: mockTotal,
        page: 2,
        pageSize: 5,
        totalPages: 1,
      });
    });

    it('testGetFoodsWithDefaultParameters', async () => {
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
        include: { foodServingUnits: { include: { servingUnit: true } } },
        skip: 0,
        take: 12,
        orderBy: { name: 'desc' },
      });

      expect(result).toEqual({
        data: mockFoods,
        total: mockTotal,
        page: 1,
        pageSize: 12,
        totalPages: 1,
      });
    });

    it('testGetFoodsThrowsErrorForInvalidFilters', async () => {
      const invalidFilters = {
        ...foodFiltersDefaultValues,
        pageSize: 200, // max is 100
      };

      await expect(getFoods(invalidFilters)).rejects.toThrow(ZodError);
    });

    it('testGetFoodsReturnsEmptyResultForNoMatches', async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        searchTerm: 'NonExistentFood',
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

    it('testGetFoodsHandlesOpenEndedRanges', async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        caloriesRange: ['100', ''], // only min
        proteinRange: ['', '20'], // only max
        pageSize: 10,
        page: 1,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue([]);

      await getFoods(filters);

      expect(prisma.food.findMany).toHaveBeenCalledWith({
        where: {
          calories: { gte: 100 },
          protein: { lte: 20 },
        },
        include: { foodServingUnits: { include: { servingUnit: true } } },
        skip: 0,
        take: 10,
        orderBy: { name: 'desc' },
      });
    });

    it('testGetFoodsTrimsSearchTerm', async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        searchTerm: '  Apple  ',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue([]);

      await getFoods(filters);

      expect(prisma.food.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ name: { contains: 'Apple' } }),
        include: { foodServingUnits: { include: { servingUnit: true } } },
        skip: 0,
        take: 12,
        orderBy: { name: 'desc' },
      });
    });

    it('testGetFoodsIgnoresInvalidCategoryId', async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        categoryId: 'abc',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue([]);

      await getFoods(filters);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const whereFromCount = (prisma.food.count as vi.Mock).mock.calls[0][0].where;
      expect(whereFromCount).not.toHaveProperty('category');
    });

    it('testGetFoodsCalculatesTotalPagesCorrectly', async () => {
      const filters: FoodFiltersSchema = {
        ...foodFiltersDefaultValues,
        pageSize: 10,
        page: 1,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.count as vi.Mock).mockResolvedValue(11);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findMany as vi.Mock).mockResolvedValue([]);

      const result = await getFoods(filters);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('getFood', () => {
    beforeEach(() => {
      // Setup default mocks for utility functions
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (toNumberSafe as vi.Mock).mockImplementation((val) => Number(val) || 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (toStringSafe as vi.Mock).mockImplementation((val) => String(val));
    });

    it('testGetFoodForExistingId', async () => {
      const foodId = 1;

      // Mock executeAction to call the actionFn directly
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findUnique as vi.Mock).mockResolvedValue(mockFoodDbResult);

      const result = await getFood(foodId);

      expect(prisma.food.findUnique).toHaveBeenCalledWith({
        where: { id: foodId },
        include: { foodServingUnits: { include: { servingUnit: true } } },
      });

      expect(result).toEqual({
        id: 1,
        name: 'Apple',
        calories: '52',
        carbohydrates: '14',
        fat: '0.2',
        fiber: '2.4',
        protein: '0.3',
        sugar: '10',
        categoryId: '1',
        foodServingUnits: [
          {
            foodServingUnitId: '1',
            grams: '100',
          },
        ],
      });
    });

    it('testGetFoodThrowsErrorForNonExistentId', async () => {
      const foodId = 999;

      // Mock executeAction to call the actionFn directly
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (prisma.food.findUnique as vi.Mock).mockResolvedValue(null);

      await expect(getFood(foodId)).rejects.toThrow(`Food with id ${foodId} not found`);

      expect(prisma.food.findUnique).toHaveBeenCalledWith({
        where: { id: foodId },
        include: { foodServingUnits: { include: { servingUnit: true } } },
      });
    });
  });

  describe('saveFood', () => {
    beforeEach(() => {
      // Setup default mocks for utility functions
      (toNumberSafe as vi.Mock).mockImplementation((val) => Number(val) || 0);
      (toStringSafe as vi.Mock).mockImplementation((val) => String(val));
    });

    it('testSaveFoodCreatesNewFoodWithServingUnits', async () => {
      const mockFoodData: FoodSchema = {
        action: 'create',
        name: 'Banana',
        calories: '89',
        protein: '1.1',
        fat: '0.3',
        carbohydrates: '23',
        fiber: '2.6',
        sugar: '12',
        categoryId: '2',
        foodServingUnits: [
          { foodServingUnitId: '1', grams: '100' },
          { foodServingUnitId: '2', grams: '150' },
        ],
      };

      const mockCreatedFood = { id: 2, name: 'Banana' };

      // Mock schema validation
      const { foodSchema } = await import(
        '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema'
      );
      (foodSchema.parse as vi.Mock).mockReturnValue(mockFoodData);

      // Mock executeAction to call the actionFn directly
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock food creation
      (prisma.food.create as vi.Mock).mockResolvedValue(mockCreatedFood);
      (prisma.foodServingUnit.createMany as vi.Mock).mockResolvedValue({ count: 2 });

      const result = await saveFood(mockFoodData);

      expect(foodSchema.parse).toHaveBeenCalledWith(mockFoodData);
      expect(prisma.food.create).toHaveBeenCalledWith({
        data: {
          name: 'Banana',
          calories: 89,
          carbohydrates: 23,
          fat: 0.3,
          protein: 1.1,
          categoryId: 2,
          sugar: 12,
          fiber: 2.6,
        },
      });
      expect(prisma.foodServingUnit.createMany).toHaveBeenCalledWith({
        data: [
          { foodId: 2, servingUnitId: 1, grams: 100 },
          { foodId: 2, servingUnitId: 2, grams: 150 },
        ],
      });
      expect(result).toEqual(mockCreatedFood);
    });

    it('testSaveFoodUpdatesExistingFoodAndReplacesServingUnits', async () => {
      const mockFoodData: FoodSchema = {
        action: 'update',
        id: 1,
        name: 'Updated Apple',
        calories: '55',
        protein: '0.4',
        fat: '0.2',
        carbohydrates: '15',
        fiber: '2.5',
        sugar: '11',
        categoryId: '1',
        foodServingUnits: [{ foodServingUnitId: '3', grams: '120' }],
      };

      const mockUpdatedFood = { id: 1, name: 'Updated Apple' };

      // Mock schema validation
      const { foodSchema } = await import(
        '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema'
      );
      (foodSchema.parse as vi.Mock).mockReturnValue(mockFoodData);

      // Mock executeAction
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock food update and serving unit operations
      (prisma.food.update as vi.Mock).mockResolvedValue(mockUpdatedFood);
      (prisma.foodServingUnit.deleteMany as vi.Mock).mockResolvedValue({ count: 1 });
      (prisma.foodServingUnit.createMany as vi.Mock).mockResolvedValue({ count: 1 });

      const result = await saveFood(mockFoodData);

      expect(prisma.food.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Apple',
          calories: 55,
          carbohydrates: 15,
          fat: 0.2,
          protein: 0.4,
          categoryId: 1,
          sugar: 11,
          fiber: 2.5,
        },
      });
      expect(prisma.foodServingUnit.deleteMany).toHaveBeenCalledWith({
        where: { foodId: 1 },
      });
      expect(prisma.foodServingUnit.createMany).toHaveBeenCalledWith({
        data: [{ foodId: 1, servingUnitId: 3, grams: 120 }],
      });
      expect(result).toEqual(mockUpdatedFood);
    });

    it('testSaveFoodCreatesNewFoodWithoutServingUnits', async () => {
      const mockFoodData: FoodSchema = {
        action: 'create',
        name: 'Orange',
        calories: '47',
        protein: '0.9',
        fat: '0.1',
        carbohydrates: '12',
        fiber: '2.4',
        sugar: '9',
        categoryId: '2',
        foodServingUnits: [],
      };

      const mockCreatedFood = { id: 3, name: 'Orange' };

      // Mock schema validation
      const { foodSchema } = await import(
        '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema'
      );
      (foodSchema.parse as vi.Mock).mockReturnValue(mockFoodData);

      // Mock executeAction
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      (prisma.food.create as vi.Mock).mockResolvedValue(mockCreatedFood);

      const result = await saveFood(mockFoodData);

      expect(prisma.food.create).toHaveBeenCalledWith({
        data: {
          name: 'Orange',
          calories: 47,
          carbohydrates: 12,
          fat: 0.1,
          protein: 0.9,
          categoryId: 2,
          sugar: 9,
          fiber: 2.4,
        },
      });
      expect(prisma.foodServingUnit.createMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockCreatedFood);
    });

    it('testSaveFoodCreatesFoodWithNullCategoryWhenEmpty', async () => {
      const mockFoodData: FoodSchema = {
        action: 'create',
        name: 'Pear',
        calories: '50',
        protein: '1',
        fat: '0.2',
        carbohydrates: '13',
        fiber: '3',
        sugar: '10',
        categoryId: '', // should become null
        foodServingUnits: [],
      };

      const mockCreatedFood = { id: 4, name: 'Pear' };
      const { foodSchema } = await import(
        '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema'
      );
      (foodSchema.parse as vi.Mock).mockReturnValue(mockFoodData);

      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      (prisma.food.create as vi.Mock).mockResolvedValue(mockCreatedFood);

      await saveFood(mockFoodData);

      expect(prisma.food.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          categoryId: null,
        }),
      });
    });

    it('testSaveFoodThrowsValidationErrorForInvalidData', async () => {
      const invalidFoodData = {
        action: 'create',
        name: '', // Invalid: empty name
        calories: 'invalid',
      } as FoodSchema;

      const validationError = new ZodError([]);

      // Mock schema validation to throw error
      const { foodSchema } = await import(
        '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema'
      );
      (foodSchema.parse as vi.Mock).mockImplementation(() => {
        throw validationError;
      });

      // Mock executeAction to call actionFn directly
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      await expect(saveFood(invalidFoodData)).rejects.toThrow(ZodError);
      expect(foodSchema.parse).toHaveBeenCalledWith(invalidFoodData);
    });

    it('testSaveFoodHandlesTransactionFailureAndRollback', async () => {
      const mockFoodData: FoodSchema = {
        action: 'create',
        name: 'Grape',
        calories: '62',
        protein: '0.6',
        fat: '0.2',
        carbohydrates: '16',
        fiber: '0.9',
        sugar: '16',
        categoryId: '2',
        foodServingUnits: [{ foodServingUnitId: '1', grams: '100' }],
      };

      const transactionError = new Error('Database transaction failed');

      // Mock schema validation
      const { foodSchema } = await import(
        '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema'
      );
      (foodSchema.parse as vi.Mock).mockReturnValue(mockFoodData);

      // Mock executeAction
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // Mock transaction to fail
      (prisma.$transaction as vi.Mock).mockRejectedValue(transactionError);

      await expect(saveFood(mockFoodData)).rejects.toThrow('Database transaction failed');
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('deleteFood', () => {
    it('testDeleteFoodRemovesFoodAndAssociatedServingUnits', async () => {
      const foodId = 1;
      const mockDeletedFood = { id: 1, name: 'Apple' };

      // Mock executeAction
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock serving unit and food deletion
      (prisma.foodServingUnit.deleteMany as vi.Mock).mockResolvedValue({ count: 2 });
      (prisma.food.delete as vi.Mock).mockResolvedValue(mockDeletedFood);

      await expect(deleteFood(foodId)).resolves.toEqual(mockDeletedFood);

      expect(prisma.foodServingUnit.deleteMany).toHaveBeenCalledWith({
        where: { foodId: 1 },
      });
      expect(prisma.food.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('testDeleteFoodHandlesTransactionFailure', async () => {
      const foodId = 1;
      const transactionError = new Error('Failed to delete food');

      // Mock executeAction
      (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
        return await actionFn();
      });

      // Mock transaction to fail
      (prisma.$transaction as vi.Mock).mockRejectedValue(transactionError);

      await expect(deleteFood(foodId)).rejects.toThrow('Failed to delete food');
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
