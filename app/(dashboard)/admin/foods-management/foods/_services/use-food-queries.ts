import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { useQuery } from "@tanstack/react-query";

// export const useFoods = () => {
//   const { foodFilters } = useFoodsStore();
//   return useQuery({
//     queryKey: ["foods", foodFilters],
//     queryFn: () => get,
//   });
// };
