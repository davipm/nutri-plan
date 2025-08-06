"use client";

import { Edit, Trash } from "lucide-react";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { useFoods } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useDeleteFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import NoItemFound from "@/components/no-item-found";
import { Pagination } from "@/components/pagination";
import { FoodCardsSkeleton } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards-skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function FoodCards() {
  const {
    updateSelectedFoodId,
    updateFoodDialogOpen,
    foodFilters,
    updateFoodFilterPage,
  } = useFoodsStore();

  const foodsQuery = useFoods();
  const deleteFoodMutation = useDeleteFood();
  const totalPages = foodsQuery.data?.totalPages;

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

                    <Button
                      className="size-6"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        alert({
                          onConfirm: () => deleteFoodMutation.mutate(item.id),
                        });
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Calories
                    </p>
                    <p className="text-sm font-medium">{item.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Carbohydrates
                    </p>
                    <p className="text-sm font-medium">
                      {item.carbohydrates} g
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Protein
                    </p>
                    <p className="text-sm font-medium">{item.protein} g</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-normal">
                      Fat
                    </p>
                    <p className="text-sm font-medium">{item.fat} g</p>
                  </div>
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
