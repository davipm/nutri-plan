'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  required?: boolean;
  containerClassName?: string;
} & ComponentProps<'input'>;

/**
 * A controlled input component that integrates with React Hook Form.
 *
 * @param {InputProps<T>} props - The properties for the controlled input component.
 * @param {string} props.className - The custom styles to apply to the input field.
 * @param {string} props.type - The type of the input field (e.g., text, email, password).
 * @param {string} props.name - The name of the input field to be used in the form.
 * @param {string} [props.label] - The label text associated with the input field.
 * @param {string} [props.containerClassName] - The custom styles to apply to the container of the input field.
 * @param {...any} props.props - Additional properties to spread on the input field.
 */
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
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <Label className="mb-2" htmlFor={name}>
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              type={type}
              id={name}
              data-slot="input"
              aria-invalid={!!error}
              className={className}
              {...field}
              {...props}
            />
            {error && <p className="text-destructive text-sm">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
}
