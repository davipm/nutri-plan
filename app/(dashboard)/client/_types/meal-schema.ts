import { requiredStringSchema } from '@/lib/zod-schemas';
import { z } from 'zod';

export const mealSchema = z
  .intersection(
    z.object({
      userId: requiredStringSchema,
      dateTime: z.date(),
      mealFoods: z.array(
        z.object({
          foodId: z.coerce
            .number()
            .int()
            .positive({
              message: 'Food ID must be a positive integer',
            })
            .nullable(),
          servingUnitId: z.coerce
            .number()
            .int()
            .positive({
              message: 'Serving Unit ID must be a positive integer',
            })
            .nullable(),
          amount: z.coerce.number().int().max(9999).positive({
            message: 'Amount must be a positive integer',
          }),
        }),
      ),
    }),
    z.discriminatedUnion('action', [
      z.object({ action: z.literal('create') }),
      z.object({ action: z.literal('update'), id: z.number().min(1) }),
    ]),
  )
  .superRefine((data, ctx) => {
    if (data.mealFoods?.some((f) => f.foodId == null || f.servingUnitId == null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mealFoods'],
        message: 'foodId and servingUnitId are required before saving.',
      });
    }
  });

export type MealSchema = z.infer<typeof mealSchema>;

export const mealDefaultValues: MealSchema = {
  action: 'create',
  mealFoods: [],
  userId: '',
  dateTime: new Date(),
};
