'use client';

import { CategoryCardsSkeleton } from '@/app/(dashboard)/admin/foods-management/categories/_components/category-cards-skeleton';
import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useDeleteCategory } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations';
import { useCategories } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-queries';
import NoItemFound from '@/components/no-item-found';
import { Button } from '@/components/ui/button';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';

export function CategoryCards() {
  const { updateSelectedCategoryId, updateCategoryDialogOpen } = useCategoriesStore();

  const categoryQuery = useCategories();
  const deleteCategoryMutation = useDeleteCategory();

  if (categoryQuery.data?.length === 0) {
    return <NoItemFound onClick={() => updateCategoryDialogOpen(true)} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {categoryQuery.isLoading ? (
        <CategoryCardsSkeleton />
      ) : (
        <>
          {categoryQuery.data?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-lg border p-6"
            >
              <p className="truncate">{item.name}</p>
              <div className="flex gap-1">
                <Button
                  className="size-6"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    updateSelectedCategoryId(item.id);
                    updateCategoryDialogOpen(true);
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
                      onConfirm: () => deleteCategoryMutation.mutate(item.id),
                    });
                  }}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
