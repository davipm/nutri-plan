"use server";

import prisma from "@/lib/prisma";
import { executeAction } from "@/lib/execute-action";
import { CategorySchema } from "@/app/(dashboard)/admin/foods-management/categories/_types/schema";

/**
 * An asynchronous function used for creating a new category in the database.
 *
 * @param {CategorySchema} data - The schema object containing the necessary information
 *                                required to create a category.
 *                                It must include a `name` property representing the
 *                                name of the category to be created.
 * @returns A promise that resolves once the category has been successfully
 *          created using the provided data.
 */
export const createCategory = async (data: CategorySchema) => {
  await executeAction({
    actionFn: async () => {
      await prisma.category.create({
        data: {
          name: data.name,
        },
      });
    },
  });
};

/**
 * Asynchronous function to update a category in the database.
 *
 * @function
 * @async
 * @param {CategorySchema} data - Object containing the category details for the update.
 * @param {string} data.action - Specifies the action to perform; should be "update" for this function to execute.
 * @param {string} data.id - The unique identifier of the category to be updated.
 * @param {string} data.name - The new name of the category to update.
 * @returns A promise that resolves when the category update is complete.
 * @throws Will throw an error if the database update operation fails.
 */
export const updateCategory = async (data: CategorySchema) => {
  if (data.action === "update") {
    await executeAction({
      actionFn: async () => {
        await prisma.category.update({
          where: { id: data.id },
          data: { name: data.name },
        });
      },
    });
  }
};

/**
 * Deletes a category with the specified identifier from the database.
 *
 * @async
 * @function deleteCategory
 * @param {number} id - The unique identifier of the category to delete.
 * @returns A promise that resolves once the category is deleted successfully.
 * @throws {Error} Throws an error if the deletion operation fails.
 */
export const deleteCategory = async (id: number) => {
  await executeAction({
    actionFn: async () => prisma.category.delete({ where: { id } }),
  });
};

/**
 * Retrieves a list of all categories from the database.
 *
 * This function asynchronously fetches and returns an array of
 * category objects by querying the database using Prisma.
 *
 * @async
 * @function
 * @returns A promise that resolves to an array of category objects.
 *          If no categories exist, an empty array is returned.
 */
export const getCategories = async () => {
  return await prisma.category.findMany();
};

/**
 * Retrieves and returns a category object with additional action information.
 *
 * The function fetches a category from the database based on the provided `id`
 * and returns an object containing the category data along with an `action` field.
 * The `action` field specifies the modification status of the category, which is
 * pre-set to `"update"`. The `id` and `name` fields are explicitly included in the
 * returned object.
 *
 * @async
 * @function
 * @param {number} id - The unique identifier of the category to retrieve.
 * @returns A promise that resolves to an object representing the category.
 */
export const getCategory = async (id: number) => {
  const response = await prisma.category.findFirst({
    where: { id },
  });

  return {
    ...response,
    id,
    action: "update",
    name: response?.name,
  };
};
