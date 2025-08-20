"use client";

import { useDeleteFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import { useFoods } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import NoItemFound from "@/components/no-item-found";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { Pagination } from "@/components/pagination";
import { FoodCardsSkeleton } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards-skeleton";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-card";

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
  const {
    updateSelectedFoodId,
    updateFoodDialogOpen,
    foodFilters,
    updateFoodFilterPage,
  } = useFoodsStore();

  const { data, isError, refetch, isRefetching, isLoading } = useFoods();
  const deleteFoodMutation = useDeleteFood();
  const totalPages = data?.totalPages;

  const handleEdit = (id: number) => {
    updateSelectedFoodId(id);
    updateFoodDialogOpen(true);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-destructive text-sm">Failed to load food items</p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? "Retrying..." : "Try Again"}
        </Button>
      </div>
    );
  }

  if (totalPages === 0) {
    return <NoItemFound onClick={() => updateFoodDialogOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <FoodCardsSkeleton />
        ) : (
          <>
            {data?.data.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item.id)}
                deleteFoodMutation={deleteFoodMutation}
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        currentPage={foodFilters.page}
        totalPages={totalPages}
        updatePage={updateFoodFilterPage}
      />
    </div>
  );
}
