import { patterns } from "@/lib/constants";
import { regexSchema } from "@/lib/zod-schemas";
import { z } from "zod";

/**
 * Schema definition for food filters used in a filtering system.
 *
 * This schema outlines the structure and validation rules for filtering
 * and sorting food items in a dataset. It includes parameters for search
 * term input, nutritional ranges, category filtering, sorting options,
 * pagination settings, and other related rules.
 *
 * Properties:
 * - searchTerm: Defines the term to search food items by name or description.
 * - caloriesRange: Specifies a tuple containing minimum and maximum calorie values.
 * - proteinRange: Specifies a tuple containing minimum and maximum protein values.
 * - categoryId: Represents the category identifier to filter food items by.
 * - sortBy: Optional parameter indicating the attribute to sort the result set by.
 * - sortOrder: Optional parameter indicating the sorting order (ascending or descending).
 * - page: Specifies the current page number for paginated results.
 * - pageSize: Specifies the number of items per page, with a maximum value of 100.
 */
export const foodFiltersSchema = z.object({
  searchTerm: z.string(),
  caloriesRange: z.tuple([
    regexSchema(patterns.zeroTo9999),
    regexSchema(patterns.zeroTo9999),
  ]),
  proteinRange: z.tuple([
    regexSchema(patterns.zeroTo9999),
    regexSchema(patterns.zeroTo9999),
  ]),
  categoryId: z.string(),
  sortBy: z
    .enum(["name", "calories", "protein", "carbohydrates", "fat"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number(),
  pageSize: z.number().max(100),
});

export type FoodFiltersSchema = z.infer<typeof foodFiltersSchema>;

export const foodFiltersDefaultValues: FoodFiltersSchema = {
  searchTerm: "",
  caloriesRange: ["0", "9999"],
  proteinRange: ["0", "9999"],
  categoryId: "",
  sortBy: "name",
  sortOrder: "desc",
  pageSize: 12,
  page: 1,
};
