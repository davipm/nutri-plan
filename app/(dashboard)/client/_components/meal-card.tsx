import type {
  MealFoodWithFood,
  MealWithFoods,
} from '@/app/(dashboard)/client/_types/meals';
import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { useDeleteMeal } from '@/app/(dashboard)/client/_services/use-mutations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { alert } from '@/store/use-global-store';
import { format } from 'date-fns';
import { Edit, Trash, Utensils } from 'lucide-react';
import { useCallback } from 'react';

type Props = {
  meal: MealWithFoods;
};

export default function MealCard({ meal }: Props) {
  const { setSelectedMealId, setMealDialogOpen } = useMealStore();

  const { mutate: deleteMealMutation } = useDeleteMeal();

  const calculateTotalCalories = (mealFoods: MealFoodWithFood[]) => {
    return mealFoods.reduce((total, mealFood) => {
      return total + (mealFood.food.calories || 0) * (mealFood.amount || 1);
    }, 0);
  };

  const totalCalories = calculateTotalCalories(meal.mealFoods);

  const handleEdit = useCallback(() => {
    setSelectedMealId(meal.id);
    setMealDialogOpen(true);
  }, [meal.id, setMealDialogOpen, setSelectedMealId]);

  const handleDelete = () => {
    alert({
      title: `Delete Meal`,
      description: 'Are you sure you want to delete this Meal? This action cannot be undone.',
      onConfirm: () => deleteMealMutation(meal.id),
    });
  };

  return (
    <div className="border-border/40 hover:border-border/80 flex flex-col gap-3 rounded-lg border p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{format(new Date(meal.dateTime), 'PPp')}</p>
          <Badge variant="outline" className="mt-1">
            {totalCalories} kcal
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button className="size-8" variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="size-4" />
          </Button>
          <Button className="size-8" variant="ghost" size="icon" onClick={handleDelete}>
            <Trash className="size-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary size-4" />
          <p className="text-foreground/70 text-sm font-medium">
            {meal.mealFoods.length} {meal.mealFoods.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {meal.mealFoods.length === 0 ? (
          <p className="text-foreground/60 text-sm italic">No foods added</p>
        ) : (
          <div className="space-y-3">
            {meal.mealFoods.map((mealFood) => (
              <div key={mealFood.id} className="bg-muted/40 rounded-md p-3">
                <div className="flex items-start justify-between">
                  <p className="font-medium">{mealFood.food.name}</p>
                  <Badge variant="secondary">
                    {(mealFood.food.calories ?? 0) * (mealFood.amount || 1)} kcal
                  </Badge>
                </div>
                <div className="text-foreground/70 mt-2 flex justify-between text-sm">
                  <div>
                    <span>Serving: </span>
                    <span className="font-medium">
                      {mealFood.amount > 0 ? mealFood.amount : 'Not specified'}{' '}
                      {mealFood.servingUnit?.name || 'serving'}
                    </span>
                  </div>

                  <div className="space-x-1 text-xs">
                    <span>P: {mealFood.food.protein}g</span>
                    <span>C: {mealFood.food.carbohydrates}g</span>
                    <span>F: {mealFood.food.fat}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
