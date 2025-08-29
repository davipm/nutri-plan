import { useSaveMeal, useDeleteMeal } from '@/app/(dashboard)/client/_services/use-mutations';
import { deleteMeal, saveMeal } from '@/app/(dashboard)/client/_services/services';
import type { MealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import type { Meal } from '@/generated/prisma/client';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';

// Mock external dependencies
vi.mock('@/app/(dashboard)/client/_services/services', () => ({
  saveMeal: vi.fn(),
  deleteMeal: vi.fn(),
}));

vi.mock('@/lib/get-error-message', () => ({
  getErrorMessage: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

describe('use-mutations', () => {
  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  const mockMutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useQueryClient as vi.Mock).mockReturnValue(mockQueryClient);
    (useMutation as vi.Mock).mockReturnValue(mockMutationResult);
  });

  describe('useSaveMeal', () => {
    it('should successfully save a meal and show success toast with "created" message', async () => {
      const mockMeal: Meal = {
        id: 1,
        userId: 123,
        dateTime: new Date('2024-01-15T12:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMealData: MealSchema = {
        action: 'create',
        userId: '123',
        dateTime: new Date('2024-01-15T12:00:00Z'),
        mealFoods: [],
      };

      let capturedOnSuccess: ((data: Meal, variables: MealSchema) => Promise<void>) | undefined;

      (useMutation as vi.Mock).mockImplementation(({ onSuccess }) => {
        capturedOnSuccess = onSuccess;
        return mockMutationResult;
      });

      (saveMeal as vi.Mock).mockResolvedValue(mockMeal);

      renderHook(() => useSaveMeal());

      // Verify mutation configuration
      expect(useMutation).toHaveBeenCalledWith({
        mutationKey: ['meals', 'save'],
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });

      // Test the mutation function
      const mutationConfig = (useMutation as vi.Mock).mock.calls[0][0];
      const result = await mutationConfig.mutationFn(mockMealData);
      expect(saveMeal).toHaveBeenCalledWith(mockMealData);
      expect(result).toBe(mockMeal);

      // Test onSuccess callback
      if (capturedOnSuccess) {
        await capturedOnSuccess(mockMeal, mockMealData);
        expect(toast.success).toHaveBeenCalledWith('Meal created successfully.');
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['meals'] });
      }
    });

    it('should successfully save a meal and show success toast with "updated" message', async () => {
      const mockMeal: Meal = {
        id: 1,
        userId: 123,
        dateTime: new Date('2024-01-15T12:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMealData: MealSchema = {
        action: 'update',
        id: '1',
        userId: '123',
        dateTime: new Date('2024-01-15T12:00:00Z'),
        mealFoods: [],
      };

      let capturedOnSuccess: ((data: Meal, variables: MealSchema) => Promise<void>) | undefined;

      (useMutation as vi.Mock).mockImplementation(({ onSuccess }) => {
        capturedOnSuccess = onSuccess;
        return mockMutationResult;
      });

      (saveMeal as vi.Mock).mockResolvedValue(mockMeal);

      renderHook(() => useSaveMeal());

      // Test onSuccess callback with update action
      if (capturedOnSuccess) {
        await capturedOnSuccess(mockMeal, mockMealData);
        expect(toast.success).toHaveBeenCalledWith('Meal updated successfully.');
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['meals'] });
      }
    });

    it('should handle save meal errors and display error toast', async () => {
      const mockError = new Error('Failed to save meal');
      const mockErrorMessage = 'Failed to save meal';

      let capturedOnError: ((error: Error) => void) | undefined;

      (useMutation as vi.Mock).mockImplementation(({ onError }) => {
        capturedOnError = onError;
        return mockMutationResult;
      });

      (getErrorMessage as vi.Mock).mockReturnValue(mockErrorMessage);

      renderHook(() => useSaveMeal());

      // Test onError callback
      if (capturedOnError) {
        capturedOnError(mockError);
        expect(getErrorMessage).toHaveBeenCalledWith(mockError);
        expect(toast.error).toHaveBeenCalledWith(mockErrorMessage);
      }
    });
  });

  describe('useDeleteMeal', () => {
    it('should successfully delete a meal and show success toast', async () => {
      const mockMeal: Meal = {
        id: 1,
        userId: 123,
        dateTime: new Date('2024-01-15T12:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mealId = 1;

      let capturedOnSuccess: ((data: Meal) => Promise<void>) | undefined;

      (useMutation as vi.Mock).mockImplementation(({ onSuccess }) => {
        capturedOnSuccess = onSuccess;
        return mockMutationResult;
      });

      (deleteMeal as vi.Mock).mockResolvedValue(mockMeal);

      renderHook(() => useDeleteMeal());

      // Verify mutation configuration
      expect(useMutation).toHaveBeenCalledWith({
        mutationKey: ['foods', 'delete'],
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });

      // Test the mutation function
      const mutationConfig = (useMutation as vi.Mock).mock.calls[0][0];
      const result = await mutationConfig.mutationFn(mealId);
      expect(deleteMeal).toHaveBeenCalledWith(mealId);
      expect(result).toBe(mockMeal);

      // Test onSuccess callback
      if (capturedOnSuccess) {
        await capturedOnSuccess(mockMeal);
        expect(toast.success).toHaveBeenCalledWith('Food deleted successfully.');
        expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['foods'] });
      }
    });

    it('should handle delete meal errors and display error toast', async () => {
      const mockError = new Error('Failed to delete meal');
      const mockErrorMessage = 'Failed to delete meal';

      let capturedOnError: ((error: Error) => void) | undefined;

      (useMutation as vi.Mock).mockImplementation(({ onError }) => {
        capturedOnError = onError;
        return mockMutationResult;
      });

      (getErrorMessage as vi.Mock).mockReturnValue(mockErrorMessage);

      renderHook(() => useDeleteMeal());

      // Test onError callback
      if (capturedOnError) {
        capturedOnError(mockError);
        expect(getErrorMessage).toHaveBeenCalledWith(mockError);
        expect(toast.error).toHaveBeenCalledWith(mockErrorMessage);
      }
    });
  });
});
