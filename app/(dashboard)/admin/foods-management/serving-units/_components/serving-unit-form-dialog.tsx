'use client';

import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import { useSaveServingUnit } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-mutations';
import { useServingUnit } from '@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries';
import {
  ServingUnitSchema,
  servingUnitDefaultValues,
  servingUnitSchema,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import { ControlledInput } from '@/components/controlled-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

type Props = {
  smallTrigger?: boolean;
};

export function ServingUnitFormDialog({ smallTrigger }: Props) {
  const {
    updateSelectedServingUnitId,
    updateServingUnitDialogOpen,
    servingUnitDialogOpen,
    selectedServingUnitId,
  } = useServingUnitsStore();

  const isEditMode = !!selectedServingUnitId;

  const form = useForm<ServingUnitSchema>({
    resolver: zodResolver(servingUnitSchema),
    defaultValues: servingUnitDefaultValues,
  });

  const { data: servingUnit } = useServingUnit();
  const { mutate: mutateSaveServingUnit, isPending } = useSaveServingUnit();

  useEffect(() => {
    if (isEditMode && servingUnit) {
      form.reset({ ...servingUnit, action: 'update' });
    } else if (!isEditMode) {
      form.reset(servingUnitDefaultValues);
    }
  }, [servingUnit, form, isEditMode]);

  const handleDialogOpenChange = (open: boolean) => {
    updateServingUnitDialogOpen(open);
    if (!open) {
      updateSelectedServingUnitId(null);
      form.reset(servingUnitDefaultValues);
    }
  };

  const onSubmit: SubmitHandler<ServingUnitSchema> = (data) => {
    mutateSaveServingUnit(data, {
      onSuccess: () => handleDialogOpenChange(false),
    });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Serving Unit' : 'Create a New Serving Unit'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ControlledInput<ServingUnitSchema>
                  name="name"
                  label="Name"
                  placeholder="Enter serving unit name"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                <span>{isEditMode ? 'Save Changes' : 'Create'}</span>
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
