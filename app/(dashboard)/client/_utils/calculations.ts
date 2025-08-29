import { MealFoodWithFood, MealWithFoods } from '@/app/(dashboard)/client/_types/meals';

export const calculateTotalCalories = (mealFoods: MealFoodWithFood[]) => {
  return mealFoods.reduce((total, mealFood) => {
    return total + (mealFood.food.calories || 0) * (mealFood.amount || 1);
  }, 0);
};

export const calculateNutritionTotal = (meals: MealWithFoods[]) => {
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
