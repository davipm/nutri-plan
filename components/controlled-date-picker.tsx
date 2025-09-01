'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useId } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
};

export function ControlledDatePicker<T extends FieldValues>({ name, label }: Props<T>) {
  const { control } = useFormContext<T>();
  const triggerId = useId();
  const errorId = `${String(name)}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...rest }, fieldState: { error } }) => (
        <Popover modal>
          {label && (
            <label htmlFor={triggerId} className="mb-2">
              {label}
            </label>
          )}
          <div className="flex flex-col gap-2">
            <PopoverTrigger asChild>
              <Button
                id={triggerId}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
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
            {error && (
              <p id={errorId} className="text-destructive text-sm">
                {error.message}
              </p>
            )}
          </div>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={onChange} autoFocus {...rest} />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
