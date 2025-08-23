import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { ComponentProps } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

interface SliderProps<T extends FieldValues>
  extends Omit<
    ComponentProps<typeof SliderPrimitive.Root>,
    'value' | 'onValueChange' | 'defaultValue'
  > {
  name: Path<T>;
  label?: string;
  minStepsBetweenThumbs?: number;
  formatValueLabel?: (value: number) => string;
  formatRangeLabel?: (index: number) => string;
}

/**
 * A controlled slider component for forms, supporting single values and ranges.
 */
export function ControlledSlider<T extends FieldValues>({
  className,
  name,
  label,
  min = 0,
  max = 100,
  minStepsBetweenThumbs = 1,
  formatValueLabel = (value) => value.toLocaleString(),
  formatRangeLabel = (index) => (index === 0 ? 'Min' : 'Max'),
  ...props
}: SliderProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleValuesChange = (newValue: number[]) => {
          if (minStepsBetweenThumbs > 0 && newValue.length > 1) {
            for (let i = 0; i < newValue.length - 1; i++) {
              if (newValue[i + 1] - newValue[i] < minStepsBetweenThumbs) {
                return;
              }
            }
          }
          field.onChange(newValue);
        };

        const value = field.value ?? [min, max];

        return (
          <div className="grid w-full gap-4 rounded-md border border-[#14424C]/20 p-4">
            {label && (
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </label>
            )}
            <SliderPrimitive.Root
              {...props}
              value={value}
              onValueChange={handleValuesChange}
              min={min}
              max={max}
              className={cn(
                'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50',
                className,
              )}
            >
              <SliderPrimitive.Track className="bg-muted relative h-1.5 w-full grow cursor-pointer overflow-hidden rounded-full">
                <SliderPrimitive.Range className="bg-primary absolute h-full" />
              </SliderPrimitive.Track>
              {value?.map((_, index) => (
                <SliderPrimitive.Thumb
                  key={index}
                  className="border-primary bg-background ring-offset-background focus-visible:ring-ring block size-4 cursor-pointer rounded-full border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                />
              ))}
            </SliderPrimitive.Root>

            <div className="flex flex-wrap gap-2">
              <ol className="flex w-full items-center gap-3">
                {value?.map((singleValue, index) => (
                  <li
                    key={index}
                    className="flex h-10 w-full items-center justify-between rounded-md border px-3"
                  >
                    <span>{formatRangeLabel(index)}</span>
                    <span>{formatValueLabel(singleValue)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
      }}
    />
  );
}
