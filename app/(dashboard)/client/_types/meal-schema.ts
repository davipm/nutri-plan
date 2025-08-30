import { patterns } from '@/lib/constants';
import { regexSchema, requiredStringSchema } from '@/lib/zod-schemas';
import { z } from 'zod';

const baseMeal = z
  .object({
    userId: requiredStringSchema,
    dateTime: z.coerce.date(),
    mealFoods: z.array(
      z
        .object({
          foodId: requiredStringSchema,
          servingUnitId: requiredStringSchema,
          amount: regexSchema(patterns.zeroTo9999).refine((v) => v.trim().length > 0, {
            message: 'Amount is required',
          }),
        })
        .strict(),
    ),
  })
  .strict();

const mealSchemaWithoutRefinement = z.discriminatedUnion('action', [
  baseMeal.extend({ action: z.literal('create') }),
  baseMeal.extend({
    action: z.literal('update'),
    id: z.number().int().positive(),
  }),
]);

export const mealSchema = mealSchemaWithoutRefinement.superRefine((data, ctx) => {
  if (data.action === 'create' && data.mealFoods.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1,
      type: 'array',
      inclusive: true,
      message: 'Add at least one item',
      path: ['mealFoods'],
    });
  }
});

// export const mealSchema = z.intersection(
//   z.object({
//     userId: requiredStringSchema,
//     dateTime: z.date(),
//     mealFoods: z.array(
//       z.object({
//         foodId: requiredStringSchema,
//         servingUnitId: requiredStringSchema,
//         amount: regexSchema(patterns.zeroTo9999),
//       }),
//     ),
//   }),
//   z.discriminatedUnion('action', [
//     z.object({ action: z.literal('create') }),
//     z.object({ action: z.literal('update'), id: z.number().min(1) }),
//   ]),
// );

export type MealSchema = z.infer<typeof mealSchemaWithoutRefinement>;

export const mealDefaultValues: MealSchema = {
  action: 'create',
  mealFoods: [],
  userId: '',
  dateTime: new Date(),
};
