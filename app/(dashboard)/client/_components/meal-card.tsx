import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { useDeleteMeal } from '@/app/(dashboard)/client/_services/use-mutations';
import type { MealWithFoods } from '@/app/(dashboard)/client/_types/meals';
import { calculateTotalCalories } from '@/app/(dashboard)/client/_utils/calculations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { alert } from '@/store/use-global-store';
import { format } from 'date-fns';
import { Edit, Trash, Utensils } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { memo } from 'react';

export const MealCard = memo(({ mealFoods, id, dateTime }: MealWithFoods) => {
  const { setSelectedMealId, setMealDialogOpen } = useMealStore();

  const { mutate: deleteMealMutation, isPending: isDeleting } = useDeleteMeal();

  const totalCalories = useMemo(() => {
    return calculateTotalCalories(mealFoods);
  }, [mealFoods]);

  const handleEdit = useCallback(() => {
    setSelectedMealId(id);
    setMealDialogOpen(true);
  }, [id, setMealDialogOpen, setSelectedMealId]);

  const handleDelete = () => {
    alert({
      title: `Delete Meal`,
      description: 'Are you sure you want to delete this Meal? This action cannot be undone.',
      onConfirm: () => deleteMealMutation(id),
    });
  };

  return (
    <div className="border-border/40 hover:border-border/80 flex flex-col gap-3 rounded-lg border p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{format(new Date(dateTime), 'PPp')}</p>
          <Badge variant="outline" className="mt-1">
            {totalCalories} kcal
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button className="size-8" variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="size-4" />
          </Button>
          <Button
            className="size-8"
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-disabled={isDeleting}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary size-4" />
          <p className="text-foreground/70 text-sm font-medium">
            {mealFoods.length} {mealFoods.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {mealFoods.length === 0 ? (
          <p className="text-foreground/60 text-sm italic">No foods added</p>
        ) : (
          <div className="space-y-3">
            {mealFoods.map(({ id, food, servingUnit, amount }) => (
              <div key={id} className="bg-muted/40 rounded-md p-3">
                <div className="flex items-start justify-between">
                  <p className="font-medium">{food.name}</p>
                  <Badge variant="secondary">{(food.calories ?? 0) * (amount || 1)} kcal</Badge>
                </div>
                <div className="text-foreground/70 mt-2 flex justify-between text-sm">
                  <div>
                    <span>Serving: </span>
                    <span className="font-medium">
                      {amount > 0 ? amount : 'Not specified'} {servingUnit?.name || 'serving'}
                    </span>
                  </div>

                  <div className="space-x-1 text-xs">
                    <span>P: {food.protein ?? 0}g</span>
                    <span>C: {food.carbohydrates ?? 0}g</span>
                    <span>F: {food.fat ?? 0}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MealCard.displayName = 'MealCard';
