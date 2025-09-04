import React, { PropsWithChildren, useEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { ControlledSelect } from "@/components/controlled-select";

// ---- Mocks for external UI and icon dependencies ----
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Provide a minimal Select implementation that can propagate onValueChange
// and render selectable items as simple buttons.
vi.mock("@/components/ui/select", () => {
  function propagate(child: any, onValueChange: any): any {
    if (!React.isValidElement(child)) return child;
    const props: any = { onValueChange };
    if (child.props && child.props.children) {
      props.children = React.Children.map(child.props.children, (c: any) =>
        propagate(c, onValueChange),
      );
    }
    return React.cloneElement(child, props);
  }
  const Select = ({ value, onValueChange, children, ...rest }: any) => (
    <div data-testid="select-root" data-value={String(value ?? '')} {...rest}>
      {React.Children.map(children as any, (child: any) => propagate(child, onValueChange))}
    </div>
  );
  const SelectTrigger = ({ children, ...props }: any) => (
    <button data-testid="select-trigger" type="button" {...props}>
      {children}
    </button>
  );
  const SelectValue = ({ placeholder }: any) => (
    <span data-testid="select-value">{placeholder}</span>
  );
  const SelectContent = ({ children }: PropsWithChildren) => (
    <div data-testid="select-content">{children}</div>
  );
  const SelectGroup = ({ children }: PropsWithChildren) => (
    <div data-testid="select-group">{children}</div>
  );
  const SelectLabel = ({ children }: PropsWithChildren) => (
    <div data-testid="select-label">{children}</div>
  );
  const SelectItem = ({ value, children, onValueChange }: any) => (
    <button
      type="button"
      data-testid={`select-item-${value}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );

  return {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
  };
});

vi.mock("lucide-react", () => ({
  X: () => <span data-testid="icon-x">x</span>,
}));

// ---- Test helpers ----

type Option = { value: string | number; label: string };

type RenderParams = {
  name: string;
  label?: string;
  clearable?: boolean;
  placeholder?: string;
  options?: Option[];
  defaultValues?: Record<string, any>;
  onReady?: (api: {
    setError: ReturnType<typeof useForm>["setError"];
    clearErrors: ReturnType<typeof useForm>["clearErrors"];
    getValues: ReturnType<typeof useForm>["getValues"];
  }) => void;
};

function ValueSpy({ name }: { name: string }) {
  const { watch } = useFormContext();
  const value = watch(name);
  return <output data-testid={`value-${name}`}>{String(value ?? "")}</output>;
}

function renderControlled({
  name,
  label = "Label",
  clearable = false,
  placeholder = "Select an option",
  options = [],
  defaultValues = {},
  onReady,
}: RenderParams) {
  const Wrapper = () => {
    const methods = useForm({ defaultValues });
    useEffect(() => {
      onReady?.({
        setError: methods.setError,
        clearErrors: methods.clearErrors,
        getValues: methods.getValues,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <FormProvider {...(methods as any)}>
        <ControlledSelect
          name={name as any}
          label={label}
          options={options}
          placeholder={placeholder}
          clearable={clearable}
        />
        <ValueSpy name={name} />
      </FormProvider>
    );
  };

  const user = userEvent.setup();
  return { user, ...render(<Wrapper />) };
}

// ---- Tests ----

describe("ControlledSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render label, trigger id and placeholder", () => {
    const name = "fruit";
    renderControlled({ name, label: "Fruit", placeholder: "Pick one" });

    // Label (disambiguate to target the actual label element)
    expect(screen.getByLabelText("Fruit")).toBeInTheDocument();

    // Trigger id equals name
    expect(screen.getByTestId("select-trigger")).toHaveAttribute("id", name);

    // Placeholder visible in mocked SelectValue
    expect(screen.getByTestId("select-value")).toHaveTextContent("Pick one");
  });

  it("Should render options and update value on selection", async () => {
    const name = "pet";
    const options = [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
    ];

    const { user } = renderControlled({ name, options });

    // Select an option (mocked SelectItem calls onValueChange)
    await user.click(screen.getByTestId("select-item-dog"));

    // Value spy should show updated value
    expect(screen.getByTestId(`value-${name}`)).toHaveTextContent("dog");
  });

  it("Should show clear button when clearable and value set, and clear selection on click", async () => {
    const name = "city";
    const options = [
      { value: "ny", label: "New York" },
      { value: "la", label: "Los Angeles" },
    ];

    const { user } = renderControlled({ name, options, clearable: true });

    // Select a value first
    await user.click(screen.getByTestId("select-item-ny"));

    // Clear button appears (aria-label from component)
    const clearBtn = screen.getByRole("button", { name: /clear selection/i });
    expect(clearBtn).toBeInTheDocument();

    // Click clear
    await user.click(clearBtn);

    // Value cleared and button disappears
    expect(screen.getByTestId(`value-${name}`)).toHaveTextContent("");
    expect(screen.queryByRole("button", { name: /clear selection/i })).toBeNull();
  });

  it("Should display error message when field has an error", async () => {
    const name = "country";
    let api: any;

    renderControlled({
      name,
      onReady: (a) => (api = a),
    });

    // Set an error programmatically via react-hook-form
    api.setError(name, { type: "manual", message: "Required field" });

    expect(
      await screen.findByText(/required field/i)
    ).toBeInTheDocument();
  });

  it("Should coerce numeric values to string internally (value and options)", async () => {
    const name = "quantity";
    const options = [
      { value: 1, label: "One" },
      { value: 2, label: "Two" },
    ];

    // Default numeric value
    renderControlled({ name, options, defaultValues: { [name]: 2 } });

    // Mocked root carries data-value from Select's value prop as string
    expect(screen.getByTestId("select-root")).toHaveAttribute("data-value", "2");

    // And selecting numeric option still works
    const user = userEvent.setup();
    await user.click(screen.getByTestId("select-item-1"));
    expect(screen.getByTestId(`value-${name}`)).toHaveTextContent("1");
  });

  it("Should render SelectLabel with the provided label inside content", () => {
    const name = "food";
    renderControlled({ name, label: "Food" });
    expect(screen.getByTestId("select-label")).toHaveTextContent("Food");
  });
});
