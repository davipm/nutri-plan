import React, { PropsWithChildren } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, useFormContext, type FieldValues } from "react-hook-form";

import { ControlledSlider } from "@/components/controlled-slider";

// ---- Mock Radix Slider primitives ----
vi.mock("@radix-ui/react-slider", () => {
  const React = require("react");

  function propagate(child: any, injected: any): any {
    if (!React.isValidElement(child)) return child;
    const props: any = { ...injected };
    if ((child as any).props && (child as any).props.children) {
      props.children = React.Children.map((child as any).props.children, (c: any) =>
        propagate(c, injected),
      );
    }
    return React.cloneElement(child, props);
  }

  const Root = ({ value = [], onValueChange, min, max, className, children, ...rest }: any) => (
    <div
      role="group"
      data-testid="slider-root"
      className={className}
      data-min={String(min)}
      data-max={String(max)}
      data-value={JSON.stringify(value)}
      {...rest}
    >
      {/* Test helpers to simulate value changes */}
      <button
        type="button"
        data-testid="action-allowed"
        onClick={() => onValueChange?.([Number(min) + 5, Number(max) - 5])}
      >
        allowed
      </button>
      <button type="button" data-testid="action-violate" onClick={() => onValueChange?.([10, 11])}>
        violate
      </button>
      <button type="button" data-testid="action-single" onClick={() => onValueChange?.([42])}>
        single
      </button>
      {React.Children.map(children as any, (child: any) => propagate(child, { onValueChange, value, min, max }))}
    </div>
  );

  const Track = ({ children, ...rest }: PropsWithChildren) => (
    <div data-testid="slider-track" {...rest}>
      {children}
    </div>
  );
  const Range = (props: any) => <div data-testid="slider-range" {...props} />;
  const Thumb = (props: any) => <button type="button" data-testid="slider-thumb" {...props} />;

  return { Root, Track, Range, Thumb };
});

// ---- Helpers ----
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
  return <output data-testid={`value-${name}`}>{Array.isArray(value) ? JSON.stringify(value) : String(value ?? "")}</output>;
}

// ---- Tests ----

describe("ControlledSlider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Renders label when provided", () => {
    type F = { r: number[] };
    render(
      <TestFormWrapper<F> defaultValues={{ r: [0, 100] }}>
        <ControlledSlider<F> name={"r"} label="Range" />
      </TestFormWrapper>,
    );

    const label = screen.getByText("Range");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  it("Falls back to [min, max] when value is not an array; renders two thumbs and labels", () => {
    type F = { r?: any };
    render(
      <TestFormWrapper<F> defaultValues={{}}>
        <ControlledSlider<F> name={"r"} min={5} max={50} />
      </TestFormWrapper>,
    );

    // Root gets min/max
    const root = screen.getByTestId("slider-root");
    expect(root).toHaveAttribute("data-min", "5");
    expect(root).toHaveAttribute("data-max", "50");

    // Two thumbs rendered (range)
    const thumbs = screen.getAllByTestId("slider-thumb");
    expect(thumbs).toHaveLength(2);

    // Range labels default to "Min" and "Max" and values default to min/max
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("Updates form value on allowed change and reflects in formatted labels", async () => {
    const user = userEvent.setup();
    type F = { r: number[] };

    render(
      <TestFormWrapper<F> defaultValues={{ r: [0, 100] }}>
        <ControlledSlider<F>
          name={"r"}
          min={0}
          max={100}
        />
        <ValueSpy name="r" />
      </TestFormWrapper>,
    );

    // Simulate an allowed change via mock action button
    await user.click(screen.getByTestId("action-allowed"));

    // Value spy reflects new range
    expect(screen.getByTestId("value-r")).toHaveTextContent("[5,95]");

    // Labels reflect updated values (default formatter uses toLocaleString)
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("95")).toBeInTheDocument();
  });

  it("Enforces minStepsBetweenThumbs by ignoring too-close updates", async () => {
    const user = userEvent.setup();
    type F = { r: number[] };

    render(
      <TestFormWrapper<F> defaultValues={{ r: [0, 100] }}>
        <ControlledSlider<F> name={"r"} minStepsBetweenThumbs={5} />
        <ValueSpy name="r" />
      </TestFormWrapper>,
    );

    // Attempt a violating update [10,11] where distance (1) < 5
    await user.click(screen.getByTestId("action-violate"));

    // Value should remain unchanged
    expect(screen.getByTestId("value-r")).toHaveTextContent("[0,100]");
  });

  it("Supports custom formatters for value and range labels", () => {
    type F = { r?: number[] };

    render(
      <TestFormWrapper<F> defaultValues={{}}>
        <ControlledSlider<F>
          name={"r"}
          min={1}
          max={3}
          formatValueLabel={(v) => `v=${v}`}
          formatRangeLabel={(i) => (i === 0 ? "Low" : "High")}
        />
      </TestFormWrapper>,
    );

    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("v=1")).toBeInTheDocument();
    expect(screen.getByText("v=3")).toBeInTheDocument();
  });

  it("Renders a single thumb when provided a single-value array", async () => {
    const user = userEvent.setup();
    type F = { v: number[] };

    render(
      <TestFormWrapper<F> defaultValues={{ v: [30] }}>
        <ControlledSlider<F> name={"v"} />
        <ValueSpy name="v" />
      </TestFormWrapper>,
    );

    // One thumb rendered
    expect(screen.getAllByTestId("slider-thumb")).toHaveLength(1);

    // Action can set to another single value
    await user.click(screen.getByTestId("action-single"));
    expect(screen.getByTestId("value-v")).toHaveTextContent("[42]");
  });

  it("Applies custom className to the Root element", () => {
    type F = { r: number[] };

    render(
      <TestFormWrapper<F> defaultValues={{ r: [0, 100] }}>
        <ControlledSlider<F> name={"r"} className="my-slider" />
      </TestFormWrapper>,
    );

    expect(screen.getByTestId("slider-root")).toHaveClass("my-slider");
  });
});
