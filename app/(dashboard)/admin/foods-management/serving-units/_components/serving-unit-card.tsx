'use client';

import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useDeleteServingUnit } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-mutations';
import { Button } from '@/components/ui/button';
import { type ServingUnit } from '@/generated/prisma';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';
import { memo, useCallback } from 'react';

type ServingUnitCardProps = {
  servingUnit: ServingUnit;
};

/**
 * Renders a card component representing a serving unit, including options to edit or delete the unit.
 *
 * @param {object} props - The properties passed to the component.
 * @param {object} props.servingUnit - The serving unit to be displayed within the card.
 * @param {string} props.servingUnit.id - The unique identifier for the serving unit.
 * @param {string} props.servingUnit.name - The name of the serving unit.
 * @returns A card component displaying the serving unit details and associated actions.
 */
function ServingUnitCard({ servingUnit }: ServingUnitCardProps) {
  const { updateSelectedServingUnitId, updateServingUnitDialogOpen } = useServingUnitsStore();
  const { mutate: servingUnitsMutation, isPending } = useDeleteServingUnit();

  const handleEdit = useCallback(() => {
    updateSelectedServingUnitId(servingUnit.id);
    updateServingUnitDialogOpen(true);
  }, [servingUnit.id, updateSelectedServingUnitId, updateServingUnitDialogOpen]);

  const handleDelete = () => {
    alert({
      title: `Delete ${servingUnit.name}`,
      description:
        'Are you sure you want to delete this serving unit? This action cannot be undone.',
      onConfirm: () => servingUnitsMutation(servingUnit.id),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{servingUnit.name}</p>
      <div className="flex items-center gap-1">
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          aria-label={`Edit ${servingUnit.name}`}
          title={`Edit ${servingUnit.name}`}
        >
          <Edit />
        </Button>
        <Button
          className="size-6"
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete ${servingUnit.name}`}
          title={`Delete ${servingUnit.name}`}
          disabled={isPending}
          aria-disabled={isPending}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}

export default memo(ServingUnitCard);
