import * as SliderPrimitive from "@radix-ui/react-slider";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface SliderProps<T extends FieldValues>
  extends ComponentProps<typeof SliderPrimitive.Root> {
  name: Path<T>;
  label?: string;
  minStepsBetweenThumbs?: number;
}

/**
 * A controlled slider component designed to handle range or single-value sliders
 * with advanced behavior and validation.
 *
 * @param {string} className - Additional class names for custom styling.
 * @param {string} name - The name used for the form field to control the slider values.
 * @param {string} label - Label displayed above the slider. Defaults to "Price Range".
 * @param {number[] | undefined} defaultValue - Optional default value for the slider. Should be a range [min, max].
 * @param {number} min - The minimum value the slider can take. Defaults to 0.
 * @param {number} max - The maximum value the slider can take. Defaults to 100.
 * @param {number} minStepsBetweenThumbs - Minimum step distance between slider thumbs when handling ranges. Defaults to 1.
 * @param {object} props - Additional SliderProps extending the base slider component functionalities.
 * @template T
 * @return Returns a controlled slider component wrapped with form control and custom rendering options.
 */
export function ControlledSlider<T extends FieldValues>({
  className,
  name,
  label = "Price Range",
  defaultValue,
  min = 0,
  max = 100,
  minStepsBetweenThumbs = 1,
  ...props
}: SliderProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        /**
         * Holds the resolved array value based on the following logic:
         * If `field.value` is an array, its value is assigned to `values`.
         * If `field.value` is not an array, `defaultValue` is checked:
         *   - If `defaultValue` is an array, its value is assigned to `values`.
         *   - Otherwise, a new array consisting of `min` and `max` is assigned to `values`.
         */
        const values = Array.isArray(field.value)
          ? field.value
          : Array.isArray(defaultValue)
            ? defaultValue
            : [min, max];

        /**
         * Handles the change of values in a numeric array while ensuring a minimum step difference
         * between consecutive values if the specified condition is met. Invokes a callback function
         * to update the values if all conditions are satisfied.
         *
         * @param {number[]} newValue - The updated array of numeric values to be processed.
         */
        const handleValuesChange = (newValue: number[]) => {
          if (minStepsBetweenThumbs > 1 && newValue.length > 1) {
            for (let i = 0; i < newValue.length - 1; i++) {
              if (newValue[i + 1] - newValue[i] < minStepsBetweenThumbs) {
                return;
              }
            }
          }
          field.onChange(newValue);
        };

        return (
          <div className="grid w-full gap-4 rounded-md border border-[#14424C]/20 p-4">
            <div className="flex items-center justify-between">
              {label && (
                <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {label}
                </label>
              )}
            </div>
            <SliderPrimitive.Root
              {...props}
              data-slot="slider"
              value={field.value ?? values}
              onValueChange={handleValuesChange}
              min={min}
              max={max}
              className={cn(
                "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                className,
              )}
            >
              <SliderPrimitive.Track
                data-slot="slider-track"
                className="bg-muted relative grow cursor-pointer overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
              >
                <SliderPrimitive.Range
                  data-slot="slider-range"
                  className="bg-primary absolute cursor-pointer data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                />
              </SliderPrimitive.Track>
              {values.map((_, index) => (
                <SliderPrimitive.Thumb
                  data-slot="slider-thumb"
                  key={index}
                  className="border-primary bg-background ring-ring/50 block size-4 shrink-0 cursor-pointer rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                />
              ))}
            </SliderPrimitive.Root>

            <div className="flex flex-wrap gap-2">
              <ol className="flex w-full items-center gap-3">
                {values.map((singleValue, index) => (
                  <li
                    key={index}
                    className="flex h-10 w-full items-center justify-between rounded-md border px-3"
                  >
                    <span>{index === 0 ? "Min" : "Max"}</span>
                    <span>{singleValue?.toLocaleString()}</span>
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
