"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  foodDefaultValues,
  foodSchema,
  FoodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useCategories } from "@/app/(dashboard)/admin/foods-management/categories/_services/use-queries";

export default function FoodFormDialog() {
  const form = useForm<FoodSchema>({
    defaultValues: foodDefaultValues,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resolver: zodResolver(foodSchema),
  });

  const foodQuery = useFood();
  const categoriesQuery = useCategories();

  return (
    <Dialog open={false} onOpenChange={() => {}}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Create Food
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
