'use client';

import ServingUnitCard from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-card';
import ServingUnitSkeleton from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-skeleton';
import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useServingUnits } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import { HasError } from '@/components/has-error';
import { NoItemFound } from '@/components/no-item-found';

export function ServingUnitCards() {
  const { updateServingUnitDialogOpen, updateSelectedServingUnitId } = useServingUnitsStore();

  const { data = [], isError, isLoading, isRefetching, refetch } = useServingUnits();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ServingUnitSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <HasError refetchAction={refetch} isRefetching={isRefetching} />;
  }

  if (!data.length) {
    return (
      <NoItemFound
        onClick={() => {
          updateServingUnitDialogOpen(true);
          updateSelectedServingUnitId(null);
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data.map((servingUnit) => (
        <ServingUnitCard key={servingUnit.id} servingUnit={servingUnit} />
      ))}
    </div>
  );
}
