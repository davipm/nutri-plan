"use client";

import { ValueLabel } from "@/types/value-labels";
import { FieldValues, Path, useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options?: ValueLabel[];
  placeholder?: string;
  clearable?: boolean;
};

/**
 * ControlledSelect is a component used to render a controlled select input field within a form managed by react-hook-form.
 * It uses the Controller component to integrate the select input with the form context and manage its state.
 *
 * @template T - The type of the form's field values.
 *
 * @param {Object} props - The props for the ControlledSelect component.
 * @param {string} [props.label] - The label text for the select input field. When provided, it is displayed above the input.
 * @param {string} props.name - The name of the select input field, used to register it within the form context.
 * @param {Array<{ value: string | number, label: string }>} [props.options=[]] - The options for the select input field, where each option has a `value` and a `label`.
 * @param {string} [props.placeholder] - The placeholder text displayed inside the select input when no option is selected.
 * @param {boolean} [props.clearable] - Determines whether a clear button is shown, allowing the user to clear the selected value.
 */
export const ControlledSelect = <T extends FieldValues>({
  label,
  name,
  options = [],
  placeholder,
  clearable,
}: SelectProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="mb-2">
          {label}
        </label>
      )}
      <Controller
        render={({
          field: { onChange, ...restField },
          fieldState: { error },
        }) => (
          <>
            <Select onValueChange={onChange} {...restField}>
              <div className="relative flex">
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                {clearable && !!restField.value && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground/40 hover:bg-accent/0 absolute top-1/2 right-8 size-4 -translate-y-1/2"
                    onClick={() => {
                      onChange("");
                    }}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {options?.map((item) => (
                    <SelectItem key={item.value} value={item.value.toString()}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error && (
              <p className="text-destructive text-sm">{error.message}</p>
            )}
          </>
        )}
        name={name}
        control={control}
      />
    </div>
  );
};
