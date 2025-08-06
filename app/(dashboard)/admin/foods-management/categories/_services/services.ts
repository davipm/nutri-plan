import { CategorySchema } from "@/app/(dashboard)/admin/foods-management/categories/_types/schema";
import { executeAction } from "@/lib/execute-action";
import prisma from "@/lib/prisma";

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

export const deleteCategory = async (id: number) => {
  await executeAction({
    actionFn: async () => prisma.category.delete({ where: { id } }),
  });
};

export const getCategories = async () => {
  return await prisma.category.findMany();
};

export const getCategory = async (id: number) => {
  const response = await prisma.category.findFirst({
    where: { id },
  });

  return {
    ...response,
    action: "update",
    name: response?.name,
    id,
  };
};
