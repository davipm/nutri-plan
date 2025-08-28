'use server';

import {
  ServingUnitSchema,
  servingUnitSchema,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';

/**
 * Asynchronously saves a serving unit to the database. Depending on the action type,
 * it either creates a new serving unit or updates an existing one.
 *
 * @param {ServingUnitSchema} data - The serving unit data, which includes the action type
 * ('create' or 'update'), the name of the serving unit, and optionally the ID for updates.
 * @returns A promise resolving to the result of the database operation.
 */
export const saveServingUnit = async (data: ServingUnitSchema) => {
  return await executeAction({
    actionFn: async () => {
      const input = servingUnitSchema.parse(data);

      if (input.action === 'create') {
        return prisma.servingUnit.create({
          data: { name: input.name },
        });
      }

      return prisma.servingUnit.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    },
  });
};

/**
 * Deletes a serving unit from the database based on the provided ID.
 *
 * This asynchronous function utilizes the `executeAction` utility to perform a
 * deletion operation on the `servingUnit` model in the database. The serving unit
 * corresponding to the specified ID is removed.
 *
 * @param {number} id - The unique identifier of the serving unit to be deleted.
 * @returns A promise that resolves once the deletion operation is complete.
 * @throws {Error} Throws an error if the operation fails or the specified ID does not exist.
 */
export const deleteServingUnit = async (id: number) => {
  return await executeAction({
    actionFn: () => prisma.servingUnit.delete({ where: { id } }),
  });
};

/**
 * Retrieves a list of all serving units from the database.
 *
 * This asynchronous function fetches a collection of serving units using the Prisma ORM.
 * It queries the `servingUnit` table and returns an array of objects representing
 * the available serving units.
 *
 * @async
 * @function getServingUnits
 * @returns A promise that resolves to an array of serving unit objects.
 */
export const getServingUnits = async () => {
  return await executeAction({
    actionFn: () => prisma.servingUnit.findMany(),
  });
};

/**
 * Function to retrieve a serving unit by its unique identifier.
 *
 * @param {number} id - The unique identifier of the serving unit to be retrieved.
 * @returns A promise that resolves to the details of the serving unit if found.
 * @throws {Error} If the serving unit with the given id is not found.
 */
export const getServingUnit = async (id: number) => {
  return await executeAction({
    actionFn: async () => {
      const response = await prisma.servingUnit.findUnique({ where: { id } });
      if (!response) throw new Error(`Serving unit with id ${id} not found`);
      return response;
    },
  });
};
