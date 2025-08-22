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

  const isPending = createServingUnitMutation.isPending || updateServingUnitMutation.isPending;

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

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };

  const onSubmit: SubmitHandler<ServingUnitSchema> = (data) => {
    if (data.action === 'create') {
      createServingUnitMutation.mutate(data, {
        onSuccess: handleSuccess,
      });
    } else {
      updateServingUnitMutation.mutate(data, { onSuccess: handleSuccess });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedServingUnitId ? 'Edit Serving Unit' : 'Create a New Serving Unit'}
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
                <span>{!!selectedServingUnitId ? 'Save Changes' : 'Create'}</span>
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
