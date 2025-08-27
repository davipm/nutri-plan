import { z } from 'zod';

export const mealFilterSchema = z.object({
  dateTime: z.coerce.date(),
});

export type MealFilterSchema = z.infer<typeof mealFilterSchema>;

export const mealFilterDefaultValues: MealFilterSchema = {
  dateTime: new Date(),
};
