import {
  deleteMeal,
  getMeal,
  getMeals,
  saveMeal,
} from '@/app/(dashboard)/client/_services/services';
import { MealFilterSchema } from '@/app/(dashboard)/client/_types/meal-filter-schema';
import { MealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import { Prisma } from '@/generated/prisma';
import { auth } from '@/lib/auth';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { toNumberSafe, toStringSafe } from '@/lib/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => {
  const auth = vi.fn();
  const getCurrentUser = vi.fn(async () => {
    const session = await auth();
    if (!session?.user?.id) throw new Error('User not authenticated');
    return session as any;
  });
  return { auth, getCurrentUser };
});

vi.mock('@/lib/prisma', () => ({
  default: {
    meal: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    mealFood: {
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

vi.mock('@/app/(dashboard)/client/_types/meal-filter-schema', () => ({
  mealFilterSchema: {
    parse: vi.fn(),
  },
}));

vi.mock('@/app/(dashboard)/client/_types/meal-schema', () => ({
  mealSchema: {
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

type MealWithFoods = Prisma.MealGetPayload<{
  include: {
    mealFoods: {
      include: {
        food: true;
        servingUnit: true;
      };
    };
  };
}>;

const mockMealDbResult: MealWithFoods = {
  id: 1,
  userId: 123,
  dateTime: new Date('2024-01-15T12:00:00Z'),
  createdAt: new Date(),
  updatedAt: new Date(),
  mealFoods: [
    {
      id: 1,
      mealId: 1,
      foodId: 1,
      amount: new Prisma.Decimal(100),
      servingUnitId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      food: {
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
      },
      servingUnit: {
        id: 1,
        name: 'grams',
        abbreviation: 'g',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ],
};

const mockSession = {
  user: {
    id: '123',
    email: 'test@example.com',
    role: 'USER',
  },
};

describe('Client Meal Services', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup default mocks for utility functions
    (toNumberSafe as vi.Mock).mockImplementation((val) => Number(val) || 0);
    (toStringSafe as vi.Mock).mockImplementation((val) => String(val));

    // Mock executeAction to call the actionFn directly by default
    (executeAction as vi.Mock).mockImplementation(async ({ actionFn }) => {
      return await actionFn();
    });
  });

  describe('getMeals', () => {
    it('should return meals for authenticated user with date filter', async () => {
      const filters: MealFilterSchema = {
        dateTime: '2024-01-15',
      };

      const mockMeals = [mockMealDbResult];

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock schema validation
      const { mealFilterSchema } = await import(
        '@/app/(dashboard)/client/_types/meal-filter-schema'
      );
      (mealFilterSchema.parse as vi.Mock).mockReturnValue(filters);

      // Mock database query
      (prisma.meal.findMany as vi.Mock).mockResolvedValue(mockMeals);

      const result = await getMeals(filters);

      expect(auth).toHaveBeenCalled();
      expect(mealFilterSchema.parse).toHaveBeenCalledWith(filters);
      expect(prisma.meal.findMany).toHaveBeenCalledWith({
        where: {
          userId: 123,
          dateTime: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
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

      expect(result).toEqual([
        {
          ...mockMealDbResult,
          userId: '123',
          mealFoods: [
            {
              ...mockMealDbResult.mealFoods[0],
              foodId: '1',
              servingUnitId: '1',
            },
          ],
        },
      ]);
    });

    it('should return meals for authenticated user without date filter', async () => {
      const filters: MealFilterSchema = {};

      const mockMeals = [mockMealDbResult];

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock schema validation
      const { mealFilterSchema } = await import(
        '@/app/(dashboard)/client/_types/meal-filter-schema'
      );
      (mealFilterSchema.parse as vi.Mock).mockReturnValue(filters);

      // Mock database query
      (prisma.meal.findMany as vi.Mock).mockResolvedValue(mockMeals);

      const result = await getMeals(filters);

      expect(prisma.meal.findMany).toHaveBeenCalledWith({
        where: {
          userId: 123,
        },
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

      expect(result).toBeDefined();
    });

    it('should throw error when user is not authenticated', async () => {
      const filters: MealFilterSchema = {};

      // Mock no authentication
      (auth as vi.Mock).mockResolvedValue(null);

      await expect(getMeals(filters)).rejects.toThrow('User not authenticated');

      expect(auth).toHaveBeenCalled();
      expect(prisma.meal.findMany).not.toHaveBeenCalled();
    });

    it('should throw error when user session exists but user ID is missing', async () => {
      const filters: MealFilterSchema = {};

      // Mock session without user ID
      (auth as vi.Mock).mockResolvedValue({ user: {} });

      await expect(getMeals(filters)).rejects.toThrow('User not authenticated');

      expect(auth).toHaveBeenCalled();
      expect(prisma.meal.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getMeal', () => {
    it('should return specific meal by ID for authenticated user', async () => {
      const mealId = 1;

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock database query
      (prisma.meal.findFirst as vi.Mock).mockResolvedValue(mockMealDbResult);

      const result = await getMeal(mealId);

      expect(auth).toHaveBeenCalled();
      expect(prisma.meal.findFirst).toHaveBeenCalledWith({
        where: { id: mealId, userId: 123 },
        include: {
          mealFoods: {
            include: {
              food: true,
              servingUnit: true,
            },
          },
        },
      });

      expect(result).toEqual({
        ...mockMealDbResult,
        userId: '123',
        mealFoods: [
          {
            ...mockMealDbResult.mealFoods[0],
            foodId: '1',
            servingUnitId: '1',
            amount: '100',
          },
        ],
      });
    });

    it('should throw error when meal is not found', async () => {
      const mealId = 999;

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock database query returning null
      (prisma.meal.findFirst as vi.Mock).mockResolvedValue(null);

      await expect(getMeal(mealId)).rejects.toThrow(`Meal with id ${mealId} not found`);

      expect(auth).toHaveBeenCalled();
      expect(prisma.meal.findFirst).toHaveBeenCalledWith({
        where: { id: mealId, userId: 123 },
        include: {
          mealFoods: {
            include: {
              food: true,
              servingUnit: true,
            },
          },
        },
      });
    });

    it('should throw error when user is not authenticated', async () => {
      const mealId = 1;

      // Mock no authentication
      (auth as vi.Mock).mockResolvedValue(null);

      await expect(getMeal(mealId)).rejects.toThrow('User not authenticated');

      expect(auth).toHaveBeenCalled();
      expect(prisma.meal.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('saveMeal', () => {
    it('should create new meal with meal foods successfully', async () => {
      const mealData: MealSchema = {
        action: 'create',
        userId: '123',
        dateTime: new Date('2024-01-15T12:00:00Z'),
        mealFoods: [
          {
            foodId: '1',
            amount: '100',
            servingUnitId: '1',
          },
          {
            foodId: '2',
            amount: '150',
            servingUnitId: '2',
          },
        ],
      };

      const mockCreatedMeal = { id: 1, userId: 123, dateTime: mealData.dateTime };

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock schema validation
      const { mealSchema } = await import('@/app/(dashboard)/client/_types/meal-schema');
      (mealSchema.parse as vi.Mock).mockReturnValue(mealData);

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock meal creation
      (prisma.meal.create as vi.Mock).mockResolvedValue(mockCreatedMeal);
      (prisma.mealFood.createMany as vi.Mock).mockResolvedValue({ count: 2 });

      const result = await saveMeal(mealData);

      expect(auth).toHaveBeenCalled();
      expect(mealSchema.parse).toHaveBeenCalledWith(mealData);
      expect(prisma.meal.create).toHaveBeenCalledWith({
        data: {
          userId: 123,
          dateTime: mealData.dateTime,
        },
      });
      expect(prisma.mealFood.createMany).toHaveBeenCalledWith({
        data: [
          {
            mealId: 1,
            foodId: 1,
            amount: 100,
            servingUnitId: 1,
          },
          {
            mealId: 1,
            foodId: 2,
            amount: 150,
            servingUnitId: 2,
          },
        ],
      });
      expect(result).toEqual(mockCreatedMeal);
    });

    it('should create new meal without meal foods successfully', async () => {
      const mealData: MealSchema = {
        action: 'create',
        userId: '123',
        dateTime: new Date('2024-01-15T12:00:00Z'),
        mealFoods: [],
      };

      const mockCreatedMeal = { id: 1, userId: 123, dateTime: mealData.dateTime };

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock schema validation
      const { mealSchema } = await import('@/app/(dashboard)/client/_types/meal-schema');
      (mealSchema.parse as vi.Mock).mockReturnValue(mealData);

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock meal creation
      (prisma.meal.create as vi.Mock).mockResolvedValue(mockCreatedMeal);

      const result = await saveMeal(mealData);

      expect(prisma.meal.create).toHaveBeenCalledWith({
        data: {
          userId: 123,
          dateTime: mealData.dateTime,
        },
      });
      expect(prisma.mealFood.createMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockCreatedMeal);
    });

    it('should update existing meal and replace meal foods', async () => {
      const mealData: MealSchema = {
        action: 'update',
        id: 1,
        userId: '123',
        dateTime: new Date('2024-01-15T13:00:00Z'),
        mealFoods: [
          {
            foodId: '3',
            amount: '200',
            servingUnitId: '3',
          },
        ],
      };

      const mockUpdatedMeal = { id: 1, userId: 123, dateTime: mealData.dateTime };

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock schema validation
      const { mealSchema } = await import('@/app/(dashboard)/client/_types/meal-schema');
      (mealSchema.parse as vi.Mock).mockReturnValue(mealData);

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock meal update and meal food operations
      (prisma.meal.update as vi.Mock).mockResolvedValue(mockUpdatedMeal);
      (prisma.mealFood.deleteMany as vi.Mock).mockResolvedValue({ count: 2 });
      (prisma.mealFood.createMany as vi.Mock).mockResolvedValue({ count: 1 });

      const result = await saveMeal(mealData);

      expect(prisma.meal.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { dateTime: mealData.dateTime },
      });
      expect(prisma.mealFood.deleteMany).toHaveBeenCalledWith({
        where: { mealId: 1 },
      });
      expect(prisma.mealFood.createMany).toHaveBeenCalledWith({
        data: [
          {
            mealId: 1,
            foodId: 3,
            amount: 200,
            servingUnitId: 3,
          },
        ],
      });
      expect(result).toEqual(mockUpdatedMeal);
    });

    it('should throw error when user is not authenticated', async () => {
      const mealData: MealSchema = {
        action: 'create',
        userId: '123',
        dateTime: new Date(),
        mealFoods: [],
      };

      // Mock no authentication
      (auth as vi.Mock).mockResolvedValue(null);

      await expect(saveMeal(mealData)).rejects.toThrow('User not authenticated');

      expect(auth).toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('deleteMeal', () => {
    it('should delete meal and associated meal foods in transaction', async () => {
      const mealId = 1;
      const mockDeletedMeal = { id: 1, userId: 123 };

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock transaction
      (prisma.$transaction as vi.Mock).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Mock meal food and meal deletion
      (prisma.mealFood.deleteMany as vi.Mock).mockResolvedValue({ count: 2 });
      (prisma.meal.delete as vi.Mock).mockResolvedValue(mockDeletedMeal);

      const result = await deleteMeal(mealId);

      expect(auth).toHaveBeenCalled();
      expect(prisma.mealFood.deleteMany).toHaveBeenCalledWith({
        where: { mealId: 1 },
      });
      expect(prisma.meal.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDeletedMeal);
    });

    it('should throw error when user is not authenticated', async () => {
      const mealId = 1;

      // Mock no authentication
      (auth as vi.Mock).mockResolvedValue(null);

      await expect(deleteMeal(mealId)).rejects.toThrow('User not authenticated');

      expect(auth).toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should handle transaction failure during deletion', async () => {
      const mealId = 1;
      const transactionError = new Error('Database transaction failed');

      // Mock authentication
      (auth as vi.Mock).mockResolvedValue(mockSession);

      // Mock transaction to fail
      (prisma.$transaction as vi.Mock).mockRejectedValue(transactionError);

      await expect(deleteMeal(mealId)).rejects.toThrow('Database transaction failed');

      expect(auth).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
