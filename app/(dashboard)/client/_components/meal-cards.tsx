'use client';

import MealCard from '@/app/(dashboard)/client/_components/meal-card';
import MealCardsSkeleton from '@/app/(dashboard)/client/_components/meal-cards-skeleton';
import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { useMeals } from '@/app/(dashboard)/client/_services/use-queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Prisma } from '@/generated/prisma';
import { format } from 'date-fns';
import { CalendarX, Flame, LineChart, PieChart, Utensils } from 'lucide-react';

type MealFromPrisma = Prisma.MealGetPayload<{
  include: {
    mealFoods: {
      include: {
        food: true;
      };
    };
  };
}>;

type MealFoodFromPrisma = Prisma.MealFoodGetPayload<{
  include: {
    food: true;
  };
}>;

type TransformedMealFood = Omit<MealFoodFromPrisma, 'foodId' | 'servingUnitId'> & {
  foodId: string;
  servingUnitId: string;
  servingUnit: {
    name: string | undefined;
  };
};

type TransformedMeal = Omit<MealFromPrisma, 'userId' | 'mealFoods'> & {
  userId: string | null;
  mealFoods: TransformedMealFood[];
};

export type MealFoodWithFood = TransformedMealFood;
export type MealWithFoods = TransformedMeal;

export function MealCards() {
  const { mealFilters, setMealDialogOpen } = useMealStore();

  const { data: mealsQuery = [], isLoading } = useMeals();

  const calculateNutritionTotal = (meals: MealWithFoods[]) => {
    return (
      meals.reduce(
        (total, meal) => {
          meal.mealFoods.forEach((mealFood) => {
            const multiplier = mealFood.amount || 1;
            total.calories += (mealFood.food.calories || 0) * multiplier;
            total.protein += (mealFood.food.protein || 0) * multiplier;
            total.carbs += (mealFood.food.carbohydrates || 0) * multiplier;
            total.fat += (mealFood.food.fat || 0) * multiplier;
            total.sugar += (mealFood.food.sugar || 0) * multiplier;
            total.fiber += (mealFood.food.fiber || 0) * multiplier;
          });
          return total;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 },
      ) || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 }
    );
  };

  const nutritionTotal = calculateNutritionTotal(mealsQuery as MealWithFoods[]);

  const displayDate = mealFilters.dateTime
    ? format(mealFilters.dateTime, 'MMMM dd, yyyy')
    : 'Today';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">{displayDate}</h2>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Flame className="text-primary mr-2 h-4 w-4" />
                Total Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nutritionTotal.calories} kcal</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <PieChart className="text-primary mr-2 h-4 w-4" />
                Macronutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-muted-foreground text-xs">Protein</p>
                  <p className="font-medium">{nutritionTotal.protein}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Carbs</p>
                  <p className="font-medium">{nutritionTotal.carbs}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fat</p>
                  <p className="font-medium">{nutritionTotal.fat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Utensils className="text-primary mr-2 h-4 w-4" />
                Meal Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="spcae-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total Meals</span>
                  <span className="font-medium">{mealsQuery.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Food Items</span>
                  <span className="font-medium">
                    {mealsQuery.reduce((total, meal) => total + meal.mealFoods.length, 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Meal</span>
                  <span className="font-medium">
                    {mealsQuery.length ? format(new Date(mealsQuery[0].dateTime), 'h:mm a') : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <LineChart className="text-primary mr-2 h-4 w-4" />
                Additional Nutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-muted-foreground text-xs">Fiber</p>
                  <p className="font-medium">{nutritionTotal.fiber}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Sugar</p>
                  <p className="font-medium">{nutritionTotal.sugar}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Meals</h3>

        {mealsQuery.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarX className="text-primary mb-2" />
            <h3 className="text-lg font-medium">No meals found</h3>
            <p className="text-foreground/60 mt-1 text-sm">
              Try adjusting your filters or add new meals
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setMealDialogOpen(true)}>
              Add new meal
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => <MealCardsSkeleton key={index} />)}

          {mealsQuery.map((meal: MealWithFoods) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
