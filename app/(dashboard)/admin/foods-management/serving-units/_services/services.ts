'use server';

import {
  ServingUnitSchema,
  servingUnitSchema,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import type { ServingUnit } from '@/generated/prisma/client';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';

export const saveServingUnit = async (data: ServingUnitSchema) => {
  const input = servingUnitSchema.parse(data);

  if (input.action === 'create') {
    return executeAction({
      actionFn: () =>
        prisma.servingUnit.create({
          data: { name: input.name },
        }),
    });
  }

  return executeAction({
    actionFn: () =>
      prisma.servingUnit.update({
        where: { id: input.id },
        data: { name: input.name },
      }),
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
  return await prisma.servingUnit.findMany();
};

export const getServingUnit = async (id: number): Promise<ServingUnit> => {
  const res = await prisma.servingUnit.findFirst({ where: { id } });

  if (!res) {
    throw new Error(`Serving unit with id ${id} not found`);
  }

  return res;
};
