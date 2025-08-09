import FoodFormDialog from "@/app/(dashboard)/admin/foods-management/foods/_components/food-form-dialog";
import { FoodCards } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards";
import { FoodFilterDrawer } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-filter-drawer";

export default function Page() {
  return (
    <div className="space-y-2">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Foods List</h1>
        <FoodFormDialog />
      </div>
      <FoodFilterDrawer />
      <FoodCards />
    </div>
  );
}
