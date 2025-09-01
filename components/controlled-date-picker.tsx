'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
};

export function ControlledDatePicker<T extends FieldValues>({ name, label }: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...rest }, fieldState: { error } }) => (
        <Popover modal>
          {label && (
            <label htmlFor={name} className="mb-2">
              {label}
            </label>
          )}
          <div className="flex flex-col gap-2">
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            {error && <p className="text-destructive text-sm">{error.message}</p>}
          </div>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={onChange} autoFocus {...rest} />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
