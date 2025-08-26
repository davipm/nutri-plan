'use server';

import {
  ServingUnitSchema,
  servingUnitSchema,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';

export const saveServingUnit = async (data: ServingUnitSchema) => {
  return executeAction({
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

export const deleteServingUnit = async (id: number) => {
  await executeAction({
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

export const getServingUnit = async (id: number) => {
  return await executeAction({
    actionFn: async () => {
      const response = await prisma.servingUnit.findUnique({ where: { id } });
      if (!response) throw new Error(`Serving unit with id ${id} not found`);
      return response;
    },
  });
};
