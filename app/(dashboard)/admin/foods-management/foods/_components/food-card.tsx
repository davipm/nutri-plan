import { useFoods } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries";
import { useDeleteFood } from "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { NutritionalInfo } from "@/app/(dashboard)/admin/foods-management/foods/_components/nutritional-info";

export type FoodData = NonNullable<
  ReturnType<typeof useFoods>["data"]
>["data"][number];

type FoodCardProps = {
  item: FoodData;
  onEdit: () => void;
  deleteFoodMutation: ReturnType<typeof useDeleteFood>;
};

export function FoodCard({ item, onEdit, deleteFoodMutation }: FoodCardProps) {
  const { mutate, variables, isPending } = deleteFoodMutation;
  const isDeleting = isPending && variables === item.id;

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-6">
      <div className="flex justify-between">
        <p className="truncate">{item.name}</p>
        <div className="flex gap-1">
          <Button
            className="size-6"
            variant="ghost"
            size="icon"
            onClick={onEdit}
          >
            <Edit />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="size-6" variant="ghost" size="icon">
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{item.name}
                  &rdquo;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => mutate(item.id)}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-5">
        <NutritionalInfo label="Calories" value={item.calories} unit="kcal" />
        <NutritionalInfo
          label="Carbohydrates"
          value={item.carbohydrates}
          unit="g"
        />
        <NutritionalInfo label="Protein" value={item.protein} unit="g" />
        <NutritionalInfo label="Fat" value={item.fat} unit="g" />
      </div>
    </div>
  );
}
