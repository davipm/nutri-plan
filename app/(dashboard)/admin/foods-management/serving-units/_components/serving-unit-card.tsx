'use client';

import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useDeleteServingUnit } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-mutations';
import { Button } from '@/components/ui/button';
import { type ServingUnit } from '@/generated/prisma';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';
import { memo } from 'react';

type ServingUnitCardProps = {
  servingUnit: ServingUnit;
};

function ServingUnitCard({ servingUnit }: ServingUnitCardProps) {
  const { updateSelectedServingUnitId, updateServingUnitDialogOpen } = useServingUnitsStore();
  const servingUnitsMutation = useDeleteServingUnit();

  // TODO useCallback
  const handleEdit = () => {
    updateSelectedServingUnitId(servingUnit.id);
    updateServingUnitDialogOpen(true);
  };

  const handleDelete = () => {
    alert({
      title: `Delete ${servingUnit.name}`,
      description:
        'Are you sure you want to delete this serving unit? This action cannot be undone.',
      onConfirm: () => servingUnitsMutation.mutate(servingUnit.id),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border p-6">
      <p className="truncate font-medium">{servingUnit.name}</p>
      <div className="flex gap-1">
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
          disabled={servingUnitsMutation.isPending}
          aria-disabled={servingUnitsMutation.isPending}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}

export default memo(ServingUnitCard);
