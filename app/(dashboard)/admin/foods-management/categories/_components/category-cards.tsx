'use client';

import CategoryCard from '@/app/(dashboard)/admin/foods-management/categories/_components/category-card';
import { CategoryCardsSkeleton } from '@/app/(dashboard)/admin/foods-management/categories/_components/category-cards-skeleton';
import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useCategories } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-queries';
import { HasError } from '@/components/has-error';
import NoItemFound from '@/components/no-item-found';

export function CategoryCards() {
  const { updateCategoryDialogOpen } = useCategoriesStore();

  const { data, isLoading, isError, refetch, isRefetching } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <CategoryCardsSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetchAction={refetch} isRefetching={isRefetching} />;
  }

  if (!data?.length) {
    return <NoItemFound onClick={() => updateCategoryDialogOpen(true)} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data?.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
