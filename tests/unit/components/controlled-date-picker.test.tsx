import React, { useEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, type FieldValues, useFormContext } from "react-hook-form";
import { format } from "date-fns";

import { ControlledDatePicker } from "@/components/controlled-date-picker";

// ---- Mocks for external UI/icon dependencies ----
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
  // Pass-through trigger to render child directly
  PopoverTrigger: ({ children }: any) => <>{children}</>,
  // Always render content for simplicity in tests
  PopoverContent: ({ children }: any) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ selected, onSelect, autoFocus, ...rest }: any) => (
    <div data-testid="calendar" data-autofocus={String(!!autoFocus)} {...rest}>
      <button
        type="button"
        data-testid="calendar-select"
        onClick={() => onSelect?.(new Date("2024-02-20T00:00:00.000Z"))}
      >
        Pick Feb 20 2024
      </button>
      <output data-testid="calendar-selected">
        {selected ? (selected instanceof Date ? selected.toISOString() : String(selected)) : ""}
      </output>
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  CalendarIcon: () => <span data-testid="icon-calendar" />,
}));

// ---- Test helpers ----

const TestFormWrapper = <T extends FieldValues>({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: T;
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const methods = useForm<T>({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

function ValueSpy({ name }: { name: string }) {
  const { watch } = useFormContext();
  const value = watch(name);
  return (
    <output data-testid={`value-${name}`}>
      {value instanceof Date ? value.toISOString() : String(value ?? "")}
    </output>
  );
}

// ---- Tests ----

describe("ControlledDatePicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Renders label and associates it with the trigger; shows placeholder when empty", () => {
    type FormVals = { dateTime: Date | null };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ dateTime: null }}>
        <ControlledDatePicker<FormVals> name={"dateTime"} label="Pick a date" />
      </TestFormWrapper>
    );

    // Label should associate with the trigger button
    const trigger = screen.getByLabelText("Pick a date");
    expect(trigger).toBeInTheDocument();

    // Placeholder visible when no value
    expect(trigger).toHaveTextContent("Pick a date");
  });

  it("Applies muted text class when empty and removes it once a date is present", async () => {
    type FormVals = { date: Date | null };

    const TestFormWithReset = ({ defaultValues }: { defaultValues: FormVals }) => {
      const methods = useForm<FormVals>({ defaultValues });
      
      // Reset form with new values to simulate updating the form
      useEffect(() => {
        methods.reset(defaultValues);
      }, [defaultValues, methods]);

      return (
        <FormProvider {...methods}>
          <ControlledDatePicker<FormVals> name={"date"} label="Date" />
        </FormProvider>
      );
    };

    const { rerender } = render(
      <TestFormWithReset defaultValues={{ date: null }} />
    );

    const button = screen.getByLabelText("Date");
    expect(button).toHaveClass("text-muted-foreground");

    // Re-render with a value to verify class removal
    rerender(
      <TestFormWithReset defaultValues={{ date: new Date("2024-01-15T00:00:00.000Z") }} />
    );

    const buttonAfter = screen.getByLabelText("Date");
    // Check if the button text content has changed (indicating the value was updated)
    expect(buttonAfter).toHaveTextContent("January 15th, 2024");
    expect(buttonAfter).not.toHaveClass("text-muted-foreground");
  });

  it("Displays formatted date when a value is set via defaultValues", () => {
    type FormVals = { dateTime: Date | null };
    const value = new Date("2024-01-15T00:00:00.000Z");

    render(
      <TestFormWrapper<FormVals> defaultValues={{ dateTime: value }}>
        <ControlledDatePicker<FormVals> name={"dateTime"} label="Date" />
      </TestFormWrapper>
    );

    const btn = screen.getByLabelText("Date");
    // Uses date-fns format with 'PPP'
    expect(btn).toHaveTextContent(format(value, "PPP"));
    expect(btn).not.toHaveClass("text-muted-foreground");
  });

  it("Selecting a date from Calendar updates the form value", async () => {
    const user = userEvent.setup();
    type FormVals = { dateTime: Date | null };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ dateTime: null }}>
        <ControlledDatePicker<FormVals> name={"dateTime"} label="Date" />
        <ValueSpy name="dateTime" />
      </TestFormWrapper>
    );

    // Click mocked calendar select button (always visible in our mock)
    await user.click(screen.getByTestId("calendar-select"));

    // Value spy should show updated ISO string
    expect(screen.getByTestId("value-dateTime")).toHaveTextContent(
      "2024-02-20T00:00:00.000Z"
    );
  });

  it("Displays validation error and sets appropriate aria attributes", async () => {
    type FormVals = { dateTime: Date | null };

    const ErrorWrapper = () => {
      const methods = useForm<FormVals>({ defaultValues: { dateTime: null } });

      useEffect(() => {
        methods.setError("dateTime", {
          type: "manual",
          message: "Date is required",
        });
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <ControlledDatePicker<FormVals> name={"dateTime"} label="Date" />
        </FormProvider>
      );
    };

    render(<ErrorWrapper />);

    const errorMsg = await screen.findByText("Date is required");
    expect(errorMsg).toBeInTheDocument();

    const btn = screen.getByLabelText("Date");
    expect(btn).toHaveAttribute("aria-invalid", "true");
    expect(btn).toHaveAttribute("aria-describedby", "dateTime-error");

    const describedBy = document.getElementById("dateTime-error");
    expect(describedBy).not.toBeNull();
    expect(describedBy).toHaveTextContent("Date is required");
  });

  it("Passes autoFocus and other rest props down to Calendar", () => {
    type FormVals = { dt: Date | null };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ dt: null }}>
        <ControlledDatePicker<FormVals> name={"dt"} label="When" />
      </TestFormWrapper>
    );

    // Our mocked Calendar exposes autoFocus via data attribute
    expect(screen.getByTestId("calendar")).toHaveAttribute(
      "data-autofocus",
      "true"
    );
  });

  it("Does not render a label when omitted", () => {
    type FormVals = { d: Date | null };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ d: null }}>
        <ControlledDatePicker<FormVals> name={"d"} />
      </TestFormWrapper>
    );

    // There is no label element for arbitrary text since we didn't provide one
    expect(screen.queryByText(/pick a date/i)).not.toBeInstanceOf(HTMLLabelElement);
  });
});
