'use client';

import { CategoryCard } from '@/app/(dashboard)/admin/foods-management/categories/_components/category-card';
import { CategoryCardsSkeleton } from '@/app/(dashboard)/admin/foods-management/categories/_components/category-cards-skeleton';
import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useCategories } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-queries';
import NoItemFound from '@/components/no-item-found';

export function CategoryCards() {
  const { updateCategoryDialogOpen } = useCategoriesStore();

  const { data, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        <CategoryCardsSkeleton />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load categories.</p>;
  }

  if (data?.length === 0) {
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
