'use client';

import ServingUnitCard from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-card';
import ServingUnitSkeleton from '@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-skeleton';
import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useServingUnits } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import NoItemFound from '@/components/no-item-found';
import { Button } from '@/components/ui/button';

export function ServingUnitCards() {
  const { updateServingUnitDialogOpen } = useServingUnitsStore();

  const { data, isError, isLoading, isRefetching, refetch } = useServingUnits();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        <ServingUnitSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alet" className="flex flex-col items-center justify-center space-y-4 py-12">
        <p>Failed to load food items</p>
        <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
          {isRefetching ? 'Retrying...' : 'Try Again'}
        </Button>
      </div>
    );
  }

  if (data?.length === 0) {
    return <NoItemFound onClick={() => updateServingUnitDialogOpen(true)} />;
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      {data?.map((servingUnit) => (
        <ServingUnitCard key={servingUnit.id} servingUnit={servingUnit} />
      ))}
    </div>
  );
}
