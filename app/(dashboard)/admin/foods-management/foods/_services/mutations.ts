import {
  foodSchema,
  FoodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { executeAction } from "@/lib/execute-action";
import prisma from "@/lib/prisma";
import { toNumberSafe } from "@/lib/utils";

/**
 * Asynchronously creates a new food record in the database based on the provided validated data.
 *
 * The function performs the following operations:
 * - Validates the input data against a defined schema (FoodSchema).
 * - Creates a new food record in the database with specified nutritional details such as name,
 *   calories, macronutrients (carbohydrates, fat, protein), category ID, sugar, and fiber values.
 * - Inserts related food serving unit information linked to the created food record.
 *
 * This function uses an action wrapper to execute these operations in a controlled manner.
 *
 * @async
 * @function createFood
 * @param {FoodSchema} data - The food information to validate and insert into the database.
 *                             It includes food properties like nutritional details and serving units.
 * @throws Will throw an error if validation fails or if there is any issue with database operations.
 */
export const createFood = async (data: FoodSchema) => {
  await executeAction({
    actionFn: async () => {
      const validatedData = foodSchema.parse(data);
      const food = await prisma.food.create({
        data: {
          name: validatedData.name,
          calories: toNumberSafe(validatedData.calories),
          carbohydrates: toNumberSafe(validatedData.carbohydrates),
          fat: toNumberSafe(validatedData.fat),
          protein: toNumberSafe(validatedData.protein),
          categoryId: toNumberSafe(validatedData.categoryId),
          sugar: toNumberSafe(validatedData.sugar),
          fiber: toNumberSafe(validatedData.fiber),
        },
      });

      await Promise.all(
        validatedData.foodServingUnits.map(async (unit) => {
          await prisma.foodServingUnit.create({
            data: {
              foodId: food.id,
              servingUnitId: toNumberSafe(unit.foodServingUnitId),
              grams: toNumberSafe(unit.grams),
            },
          });
        }),
      );
    },
  });
};

/**
 * Updates an existing food entry in the database with the provided data.
 *
 * This function validates the data against the defined food schema, checks the
 * action type, and performs an update operation if the action is set to "update."
 * The food's attributes, as well as associated serving unit information, are updated
 * in the database.
 *
 * @async
 * @function updateFood
 * @param {FoodSchema} data - The food data object to be updated. It includes properties
 * such as name, calories, carbohydrates, fat, fiber, sugar, protein, categoryId, and
 * associated foodServingUnits.
 * @throws {Error} Throws an error if the validation fails or if any part of the database
 * update operation encounters an issue.
 */
export const updateFood = async (data: FoodSchema) => {
  await executeAction({
    actionFn: async () => {
      const validateFood = foodSchema.parse(data);
      if (validateFood.action === "update") {
        await prisma.food.update({
          where: {
            id: validateFood.id,
          },
          data: {
            name: validateFood.name,
            calories: toNumberSafe(validateFood.calories),
            carbohydrates: toNumberSafe(validateFood.carbohydrates),
            fat: toNumberSafe(validateFood.fat),
            fiber: toNumberSafe(validateFood.fiber),
            sugar: toNumberSafe(validateFood.sugar),
            protein: toNumberSafe(validateFood.protein),
            categoryId: toNumberSafe(validateFood.categoryId) || null,
          },
        });

        await prisma.foodServingUnit.deleteMany({
          where: {
            foodId: validateFood.id,
          },
        });

        await Promise.all(
          validateFood.foodServingUnits.map(async (unit) => {
            await prisma.foodServingUnit.create({
              data: {
                foodId: validateFood.id,
                servingUnitId: toNumberSafe(unit.foodServingUnitId),
                grams: toNumberSafe(unit.grams),
              },
            });
          }),
        );
      }
    },
  });
};

/**
 * Deletes a food item along with its related serving unit records from the database.
 *
 * This function performs a cascading delete operation where it first deletes all
 * serving unit records associated with the specified food item, and then deletes
 * the food item itself. The operation is handled within an `executeAction` wrapper
 * for consistent processing.
 *
 * @param {number} id - The unique identifier of the food item to be deleted.
 * @throws {Error} Throws an error if the deletion fails at any stage.
 */
export const deleteFood = async (id: number) => {
  await executeAction({
    actionFn: async () => {
      await prisma.foodServingUnit.deleteMany({
        where: {
          foodId: id,
        },
      });

      await prisma.food.delete({
        where: {
          id,
        },
      });
    },
  });
};
