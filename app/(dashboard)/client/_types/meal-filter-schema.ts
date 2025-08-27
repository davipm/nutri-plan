import { z } from 'zod';

export const mealFilterSchema = z.object({
  deleteTime: z.coerce.date(),
});

type MealFilterSchema = z.infer<typeof mealFilterSchema>;

export const mealFilterDefaultValues: MealFilterSchema = {
  deleteTime: new Date(),
};
