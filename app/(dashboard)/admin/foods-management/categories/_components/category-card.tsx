import { useCategoriesStore } from '@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store';
import { useDeleteCategory } from '@/app/(dashboard)/admin/foods-management/categories/_services/use-mutations';
import { Button } from '@/components/ui/button';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';
import { memo, useCallback } from 'react';

type Props = {
  id: number;
  name: string;
};

export const CategoryCard = memo(({ id, name }: Props) => {
  const { setSelectedCategoryId, setCategoryDialogOpen } = useCategoriesStore();
  const { mutate: deleteCategoryMutation, isPending } = useDeleteCategory();

  const handleEdit = useCallback(() => {
    setSelectedCategoryId(id);
    setCategoryDialogOpen(true);
  }, [id, setSelectedCategoryId, setCategoryDialogOpen]);

  const handleDelete = () => {
    alert({
      title: `Delete ${name}`,
      description: 'Are you sure you want to delete this category? This action cannot be undone.',
      onConfirm: () => deleteCategoryMutation(id),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{name}</p>
      <div className="flex items-center gap-1">
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleEdit}
          aria-label={`Edit ${name}`}
          title={`Edit ${name}`}
        >
          <Edit />
        </Button>
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${name}`}
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
