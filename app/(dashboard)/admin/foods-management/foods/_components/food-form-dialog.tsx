"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  foodDefaultValues,
  foodSchema,
  FoodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useCategories } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-queries";
import {
  useCreateFood,
  useUpdateFood,
} from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";

export default function FoodFormDialog() {
  const form = useForm<FoodSchema>({
    defaultValues: foodDefaultValues,
    resolver: zodResolver(foodSchema),
  });

  const foodQuery = useFood();
  const categoriesQuery = useCategories();

  const createFoodMutation = useCreateFood();
  const updateFoodMutation = useUpdateFood();

  const isPending =
    createFoodMutation.isPending || updateFoodMutation.isPending;

  const {
    selectedFoodId,
    updateSelectedFoodId,
    foodDialogOpen,
    updateFoodDialogOpen,
  } = useFoodsStore();

  return (
    <Dialog open={foodDialogOpen} onOpenChange={() => {}}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Create Food
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedFoodId ? "Edit Food" : "Create a New Food"}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
