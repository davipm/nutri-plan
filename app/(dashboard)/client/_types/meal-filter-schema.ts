import { z } from 'zod';

export const mealFilterSchema = z.object({
  dateTime: z.coerce.date(),
});

export type MealFilterSchema = z.infer<typeof mealFilterSchema>;

export const getMealFilterDefaultValues = (): MealFilterSchema => ({
  dateTime: new Date(),
});

export const mealFilterDefaultValues: MealFilterSchema = getMealFilterDefaultValues();

// export const mealFilterDefaultValues: MealFilterSchema = {
//   dateTime: new Date(),
// };
