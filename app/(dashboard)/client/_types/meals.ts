import { Prisma } from '@/generated/prisma';

type MealFromPrisma = Prisma.MealGetPayload<{
  include: {
    mealFoods: {
      include: {
        food: true;
        servingUnit: true;
      };
    };
  };
}>;

type MealFoodFromPrisma = Prisma.MealFoodGetPayload<{
  include: {
    food: true;
    servingUnit: true;
  };
}>;

type TransformedMealFood = Omit<
  MealFoodFromPrisma,
  'foodId' | 'servingUnitId'
> & {
  foodId: string;
  servingUnitId: string;
};

type TransformedMeal = Omit<MealFromPrisma, 'userId' | 'mealFoods'> & {
  userId: string | null;
  mealFoods: TransformedMealFood[];
};

export type MealFoodWithFood = TransformedMealFood;
export type MealWithFoods = TransformedMeal;
