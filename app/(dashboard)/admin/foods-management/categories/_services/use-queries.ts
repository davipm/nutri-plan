import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategory,
} from "@/app/(dashboard)/admin/foods-management/categories/_services/services";
import { useCategoriesStore } from "@/app/(dashboard)/admin/foods-management/categories/_libs/use-categories-store";

/**
 * A custom hook that retrieves the list of categories using a query.
 *
 * @function
 * @returns The query result object containing data, status, and other properties provided by the query library.
 * @description This hook uses the `useQuery` function to fetch the categories from an API or data source.
 * The query is identified by the key "categories" and will invoke the `getCategories` function as its query function.
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useCategory = () => {
  const { selectedCategoryId } = useCategoriesStore();

  return useQuery({
    queryKey: ["categories", { selectedCategoryId: selectedCategoryId! }],
    queryFn: () => getCategory(selectedCategoryId!),
    enabled: !!selectedCategoryId,
  });
};
