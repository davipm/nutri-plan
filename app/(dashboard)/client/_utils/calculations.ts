import { MealFoodWithFood, MealWithFoods } from '@/app/(dashboard)/client/_types/meals';

/**
 * Calculates the total calories for a given array of meal foods.
 *
 * This function computes the total calorie count by iterating over the provided meal foods
 * and summing up the product of each food's calorie value and its corresponding amount.
 * If the calorie value or amount is undefined, it defaults to 0 for calories and 1 for amount.
 *
 * @param {MealFoodWithFood[]} mealFoods - An array of meal food objects, each containing a food item and its associated amount.
 * @returns The total calorie count for the provided meal foods.
 */
export const calculateTotalCalories = (mealFoods: MealFoodWithFood[]) => {
  return mealFoods.reduce((total, mealFood) => {
    return total + (mealFood.food.calories ?? 0) * (mealFood.amount ?? 1);
  }, 0);
};

/**
 * Calculates the total nutritional values of all meals provided in the input.
 *
 * @param {MealWithFoods[]} meals - An array of meal objects, where each meal contains a collection of foods and their respective amounts.
 * @returns An object containing the aggregated nutritional totals for calories, protein, carbohydrates, fat, sugar, and fiber.
 */
export const calculateNutritionTotal = (meals: MealWithFoods[]) => {
  return (
    meals.reduce(
      (total, meal) => {
        meal.mealFoods.forEach((mealFood) => {
          const multiplier = mealFood.amount ?? 1;
          total.calories += (mealFood.food.calories ?? 0) * multiplier;
          total.protein += (mealFood.food.protein ?? 0) * multiplier;
          total.carbs += (mealFood.food.carbohydrates ?? 0) * multiplier;
          total.fat += (mealFood.food.fat ?? 0) * multiplier;
          total.sugar += (mealFood.food.sugar ?? 0) * multiplier;
          total.fiber += (mealFood.food.fiber ?? 0) * multiplier;
        });
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 },
    ) || { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0 }
  );
};
