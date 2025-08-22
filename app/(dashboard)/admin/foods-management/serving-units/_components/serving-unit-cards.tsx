'use client';

import ServingUnitSkeleton from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-skeleton';
import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useDeleteServingUnit } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-mutations';
import { useServingUnits } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import NoItemFound from '@/components/no-item-found';
import { Button } from '@/components/ui/button';
import { alert } from '@/store/use-global-store';
import { Edit, Trash } from 'lucide-react';

export function ServingUnitCards() {
  const { updateSelectedServingUnitId, updateServingUnitDialogOpen } = useServingUnitsStore();

  const servingUnitsQuery = useServingUnits();
  const servingUnitsMutation = useDeleteServingUnit();

  if (servingUnitsQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        <ServingUnitSkeleton />
      </div>
    );
  }

  if (servingUnitsQuery.data?.length === 0) {
    return <NoItemFound onClick={() => updateServingUnitDialogOpen(true)} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {servingUnitsQuery.data?.map((servingUnit) => (
        <div
          key={servingUnit.id}
          className="flex flex-col justify-between gap-3 rounded-lg border p-6"
        >
          <p className="truncate">{servingUnit.name}</p>
          <div className="flex gap-1">
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              onClick={() => {
                updateSelectedServingUnitId(servingUnit.id);
                updateServingUnitDialogOpen(true);
              }}
            >
              <Edit />
            </Button>
            <Button
              className="size-6"
              variant="ghost"
              size="icon"
              onClick={() => {
                alert({
                  title: `Delete ${servingUnit.name}`,
                  description:
                    'Are you sure you want to delete this serving unit? This action cannot be undone.',
                  onConfirm: () => servingUnitsMutation.mutate(servingUnit.id),
                });
              }}
            >
              <Trash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
