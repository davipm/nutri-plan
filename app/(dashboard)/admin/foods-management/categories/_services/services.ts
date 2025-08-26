'use server';

import {
  CategorySchema,
  categorySchema,
} from '@/app/(dashboard)/admin/foods-management/categories/_types/schema';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';

export const saveCategory = async (data: CategorySchema) => {
  const input = categorySchema.parse(data);

  if (input.action === 'create') {
    return executeAction({
      actionFn: async () => {
        await prisma.category.create({
          data: { name: data.name },
        });
      },
    });
  }

  await executeAction({
    actionFn: async () => {
      return prisma.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    },
  });
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
  const response = await prisma.category.findFirst({ where: { id } });

  if (!response) {
    throw new Error(`Category with id ${id} not found`);
  }

  return response;
};
