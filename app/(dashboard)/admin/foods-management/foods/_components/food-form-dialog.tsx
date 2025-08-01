"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  foodDefaultValues,
  foodSchema,
  FoodSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import { Dialog } from "@radix-ui/react-dialog";

export default function FoodFormDialog() {
  const form = useForm<FoodSchema>({
    defaultValues: foodDefaultValues,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resolver: zodResolver(foodSchema),
  });

  return (
    <Dialog>
      <p>FoodFormDialog</p>
    </Dialog>
  );
}
