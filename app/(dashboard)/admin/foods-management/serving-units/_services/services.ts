'use server';

import { servingUnitSchema } from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import { ServingUnitSchema } from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';

export const createServingUnit = async (data: ServingUnitSchema) => {
  const input = servingUnitSchema.parse(data);
  if (data.action !== 'create') {
    throw new Error('Invalid action for create.');
  }

  await executeAction({
    actionFn: () =>
      prisma.servingUnit.create({
        data: { name: input.name },
      }),
  });
};

export const updateServingUnit = async (data: ServingUnitSchema) => {
  const input = servingUnitSchema.parse(data);

  if (data.action !== 'update') {
    throw new Error('Invalid action for update.');
  }

  await executeAction({
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

export const getServingUnit = async (id: number): Promise<ServingUnitSchema> => {
  const res = await prisma.servingUnit.findFirst({ where: { id } });

  if (!res) {
    throw new Error(`Serving unit with id ${id} not found`);
  }

  return {
    id: res.id,
    name: res.name,
    action: 'update',
  };
};
