'use client';

import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import {
  useCreateServingUnit,
  useUpdateServingUnit,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-mutations';
import { useServingUnit } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import {
  ServingUnitSchema,
  servingUnitDefaultValues,
  servingUnitSchema,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  smallTrigger?: boolean;
};

export function ServingUnitFormDialog({ smallTrigger }: Props) {
  const form = useForm<ServingUnitSchema>({
    resolver: zodResolver(servingUnitSchema),
    defaultValues: servingUnitDefaultValues,
  });

  const {
    updateSelectedServingUnitId,
    updateServingUnitDialogOpen,
    servingUnitDialogOpen,
    selectedServingUnitId,
  } = useServingUnitsStore();

  const servingUnitQuery = useServingUnit();
  const createServingUnitMutation = useCreateServingUnit();
  const updateServingUnitMutation = useUpdateServingUnit();

  useEffect(() => {
    if (!!selectedServingUnitId && servingUnitQuery.data) {
      form.reset(servingUnitQuery.data);
    }
  }, [form, selectedServingUnitId, servingUnitQuery.data]);

  const handleDialogOpenChange = (open: boolean) => {
    updateServingUnitDialogOpen(open);
    if (!open) {
      updateSelectedServingUnitId(null);
      form.reset(servingUnitDefaultValues);
    }
  };

  return (
    <Dialog open={servingUnitDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            New Serving Unit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
