"use client";

import { ComponentProps, useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  containerClassName?: string;
} & ComponentProps<"input">;

export function ControlledInput<T extends FieldValues>({
  className,
  type,
  name,
  label,
  containerClassName,
  ...props
}: InputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <div>
      <p></p>
    </div>
  );
}
