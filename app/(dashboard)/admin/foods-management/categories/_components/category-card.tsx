'use client';

import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useDeleteCategory } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations';
import { Button } from '@/components/ui/button';
import { Category } from '@/generated/prisma';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';
import { memo } from 'react';

type CategoryCardProps = {
  category: Category;
};

function CategoryCard({ category }: CategoryCardProps) {
  const { updateSelectedCategoryId, updateCategoryDialogOpen } = useCategoriesStore();
  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = () => {
    updateSelectedCategoryId(category.id);
    updateCategoryDialogOpen(true);
  };

  const handleDelete = () => {
    alert({
      title: `Delete ${category.name}`,
      description: 'Are you sure you want to delete this category? This action cannot be undone.',
      onConfirm: () => deleteCategoryMutation.mutate(category.id),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{category.name}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          aria-label={`Edit ${category.name}`}
        >
          <Edit className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete ${category.name}`}
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default memo(CategoryCard);
