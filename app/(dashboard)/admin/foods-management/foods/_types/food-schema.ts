import { z } from "zod";
import { patterns } from "@/lib/constants";
import { regexSchema, requiredStringSchema } from "@/lib/zod-schemas";

/**
 * Represents a schema definition for a food item, combining general food attributes
 * and a discriminated union for action type ("create" or "update").
 *
 * The schema validates the structure and data types of a food object, including its attributes,
 * nutritional values, serving units, and an action type to define whether the food item is
 * to be created or updated.
 *
 * - `name` (required): A string representing the name of the food item.
 * - `calories`: A string matching the pattern for values between 0 and 9999, representing the caloric value.
 * - `protein`: A string matching the pattern for values between 0 and 9999, representing the protein content.
 * - `fat`: A string matching the pattern for values between 0 and 9999, representing the fat content.
 * - `carbohydrates`: A string matching the pattern for values between 0 and 9999, representing the carbohydrate content.
 * - `fiber`: A string matching the pattern for values between 0 and 9999, representing the fiber content.
 * - `sugar`: A string matching the pattern for values between 0 and 9999, representing the sugar content.
 * - `categoryId` (required): A string representing the category ID to which the food item belongs.
 * - `foodServingUnits`: An array of objects where each object represents a serving unit for the food item, including:
 *   - `foodServingUnitId` (required): A string representing the serving unit ID.
 *   - `grams`: A string matching the pattern for values between 0 and 9999, representing the serving size in grams.
 * - `action`: A discriminated union that indicates the action to be performed on the food item:
 *   - `"create"`: Indicates that the food item is being created.
 *   - `"update"`: Indicates that the food item is being updated. Includes `id`, a numeric identifier for the food item.
 */
export const foodSchema = z.intersection(
  z.object({
    name: requiredStringSchema,
    calories: regexSchema(patterns.zeroTo9999),
    protein: regexSchema(patterns.zeroTo9999),
    fat: regexSchema(patterns.zeroTo9999),
    carbohydrates: regexSchema(patterns.zeroTo9999),
    fiber: regexSchema(patterns.zeroTo9999),
    sugar: regexSchema(patterns.zeroTo9999),
    categoryId: requiredStringSchema,
    foodServingUnits: z.array(
      z.object({
        foodServingUnitId: requiredStringSchema,
        grams: regexSchema(patterns.zeroTo9999),
      }),
    ),
  }),
  z.discriminatedUnion("action", [
    z.object({ action: z.literal("create") }),
    z.object({ action: z.literal("update"), id: z.number() }),
  ]),
);

export type FoodSchema = z.infer<typeof foodSchema>;

export const foodDefaultValues: FoodSchema = {
  action: "create",
  foodServingUnits: [],
  name: "",
  categoryId: "",
  calories: "",
  carbohydrates: "",
  fat: "",
  fiber: "",
  protein: "",
  sugar: "",
};

export const servingUnitSchema = z.intersection(
  z.object({
    name: requiredStringSchema,
  }),
  z.discriminatedUnion("action", [
    z.object({ action: z.literal("create") }),
    z.object({ action: z.literal("update"), id: z.number() }),
  ]),
);
