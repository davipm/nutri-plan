'use client';

import MealCard from '@/app/(dashboard)/client/_components/meal-card';
import MealCardsSkeleton from '@/app/(dashboard)/client/_components/meal-cards-skeleton';
import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { useMeals } from '@/app/(dashboard)/client/_services/use-queries';
import { MealWithFoods } from '@/app/(dashboard)/client/_types/meals';
import { calculateNutritionTotal } from '@/app/(dashboard)/client/_utils/calculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarX, Flame, LineChart, PieChart, Utensils } from 'lucide-react';
import { useMemo } from 'react';

export function MealCards() {
  const { mealFilters, setMealDialogOpen } = useMealStore();

  const { data: mealsQuery = [], isLoading } = useMeals();

  const meals = useMemo(() => {
    return mealsQuery as MealWithFoods[];
  }, [mealsQuery]);

  const nutritionTotal = useMemo(() => {
    return calculateNutritionTotal(meals);
  }, [meals]);

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
                  <span className="font-medium">{meals.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Food Items</span>
                  <span className="font-medium">
                    {meals.reduce((total, meal) => total + meal.mealFoods.length, 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Meal</span>
                  <span className="font-medium">
                    {meals.length ? format(new Date(meals[0].dateTime), 'h:mm a') : 'N/A'}
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

        {meals.length === 0 && !isLoading && (
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

          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
