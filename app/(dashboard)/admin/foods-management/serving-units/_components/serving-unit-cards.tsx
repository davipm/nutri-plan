'use client';

import ServingUnitCard from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-card';
import ServingUnitSkeleton from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-skeleton';
import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useServingUnits } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import NoItemFound from '@/components/no-item-found';

export function ServingUnitCards() {
  const { updateServingUnitDialogOpen } = useServingUnitsStore();

  const servingUnitsQuery = useServingUnits();

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
        <ServingUnitCard key={servingUnit.id} servingUnit={servingUnit} />
      ))}
    </div>
  );
}
