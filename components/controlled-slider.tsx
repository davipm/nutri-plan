import { ComponentProps } from "react";
import { FieldValues, Path } from "react-hook-form";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps<T extends FieldValues>
  extends ComponentProps<typeof SliderPrimitive.Root> {
  name: Path<T>;
  label?: string;
  minStepsBetweenThumbs?: number;
}

// TODO: Implement controlled slider
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
  return (
    <div>
      <div></div>
    </div>
  );
}
