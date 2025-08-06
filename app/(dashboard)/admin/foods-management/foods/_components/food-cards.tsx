"use client";

import { Edit, Trash } from "lucide-react";
import NoItemFound from "@/components/no-item-found";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { Pagination } from "@/components/pagination";
import { useFoods } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useDeleteFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import { FoodCardsSkeleton } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards-skeleton";
import { NutritionalInfo } from "@/app/(dashboard)/admin/foods-management/foods/_components/nutritional-info";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  // Store hooks for managing component state
  const {
    updateSelectedFoodId,
    updateFoodDialogOpen,
    foodFilters,
    updateFoodFilterPage,
  } = useFoodsStore();

  // Query and mutation hooks
  const foodsQuery = useFoods();
  const deleteFoodMutation = useDeleteFood();
  const totalPages = foodsQuery.data?.totalPages;

  // Handle error state
  if (foodsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-destructive text-sm">Failed to load food items</p>
        <Button
          variant="outline"
          onClick={() => foodsQuery.refetch()}
          disabled={foodsQuery.isRefetching}
        >
          {foodsQuery.isRefetching ? "Retrying..." : "Try Again"}
        </Button>
      </div>
    );
  }

  // Handle empty state
  if (totalPages === 0) {
    return <NoItemFound onClick={() => updateFoodDialogOpen(true)} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
        {foodsQuery.isLoading ? (
          <FoodCardsSkeleton />
        ) : (
          <>
            {foodsQuery.data?.data.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border p-6"
              >
                <div className="flex justify-between">
                  <p className="truncate">{item.name}</p>
                  <div className="flex gap-1">
                    <Button
                      className="size-6"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        updateSelectedFoodId(item.id);
                        updateFoodDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="size-6" variant="ghost" size="icon">
                          <Trash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &ldquo;{item.name}
                            &rdquo;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFoodMutation.mutate(item.id)}
                            disabled={deleteFoodMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteFoodMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-5">
                  <NutritionalInfo
                    label="Calories"
                    value={item.calories}
                    unit="kcal"
                  />
                  <NutritionalInfo
                    label="Carbohydrates"
                    value={item.carbohydrates}
                    unit="g"
                  />
                  <NutritionalInfo
                    label="Protein"
                    value={item.protein}
                    unit="g"
                  />
                  <NutritionalInfo label="Fat" value={item.fat} unit="g" />
                </div>
              </div>
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
