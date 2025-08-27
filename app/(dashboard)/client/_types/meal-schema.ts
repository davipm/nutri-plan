import { patterns } from '@/lib/constants';
import { regexSchema, requiredStringSchema } from '@/lib/zod-schemas';
import { z } from 'zod';

export const mealSchema = z.intersection(
  z.object({
    userId: requiredStringSchema,
    dateTime: z.date(),
    mealFoods: z.array(
      z.object({
        foodId: requiredStringSchema,
        servingUnitId: requiredStringSchema,
        amount: regexSchema(patterns.zeroTo9999),
      }),
    ),
  }),
  z.discriminatedUnion('action', [
    z.object({ action: z.literal('create') }),
    z.object({ action: z.literal('update'), id: z.number().min(1) }),
  ]),
);

export type MealSchema = z.infer<typeof mealSchema>;

export const mealDefaultValues: MealSchema = {
  action: 'create',
  mealFoods: [],
  userId: '',
  dateTime: new Date(),
};
