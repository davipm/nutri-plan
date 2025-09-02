import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useDeleteCategory } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations';
import { Button } from '@/components/ui/button';
import type { Category } from '@/generated/prisma';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';
import { memo, useCallback } from 'react';

type CategoryCardProps = {
  category: Category;
};

export const CategoryCard = memo(({ category }: CategoryCardProps) => {
  const { setSelectedCategoryId, setCategoryDialogOpen } = useCategoriesStore();
  const { mutate: deleteCategoryMutation, isPending } = useDeleteCategory();

  const handleEdit = useCallback(() => {
    setSelectedCategoryId(category.id);
    setCategoryDialogOpen(true);
  }, [category.id, setSelectedCategoryId, setCategoryDialogOpen]);

  const handleDelete = () => {
    alert({
      title: `Delete ${category.name}`,
      description: 'Are you sure you want to delete this category? This action cannot be undone.',
      onConfirm: () => deleteCategoryMutation(category.id),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{category.name}</p>
      <div className="flex items-center gap-1">
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          aria-label={`Edit ${category.name}`}
          title={`Edit ${category.name}`}
        >
          <Edit />
        </Button>
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete ${category.name}`}
          disabled={isPending}
          aria-disabled={isPending}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';
