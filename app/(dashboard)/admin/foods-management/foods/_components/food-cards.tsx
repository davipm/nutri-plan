'use client';

import { FoodCard } from '@/app/(dashboard)/admin/foods-management/foods/_components/food-card';
import { FoodCardsSkeleton } from '@/app/(dashboard)/admin/foods-management/foods/_components/food-cards-skeleton';
import { useFoodsStore } from '@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store';
import { useDeleteFood } from '@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations';
import { useFoods } from '@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries';
import { HasError } from '@/components/has-error';
import NoItemFound from '@/components/no-item-found';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

/**
 * FoodCards component displays a grid of food items with CRUD operations
 * Features:
 * - Grid layout with responsive design
 * - Edit and delete functionality with confirmation dialog
 * - Loading states and error handling
 * - Pagination support
 * - Nutritional information display
 */
export function FoodCards() {
  const { updateSelectedFoodId, updateFoodDialogOpen, foodFilters, updateFoodFilterPage } =
    useFoodsStore();

  const { data, isError, refetch, isRefetching, isLoading } = useFoods();
  const deleteFoodMutation = useDeleteFood();

  const handleEdit = useCallback(
    (id: number) => {
      updateSelectedFoodId(id);
      updateFoodDialogOpen(true);
    },
    [updateSelectedFoodId, updateFoodDialogOpen],
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <FoodCardsSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetch={refetch} isRefetching={isRefetching} />;
  }

  if (!data?.data.length) {
    return <NoItemFound onClick={() => updateFoodDialogOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {data.data.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item.id)}
            deleteFoodMutation={deleteFoodMutation}
          />
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={foodFilters.page}
          totalPages={data.totalPages}
          updatePage={updateFoodFilterPage}
        />
      )}
    </div>
  );
}
