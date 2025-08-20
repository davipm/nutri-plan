import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import { ControlledInput } from "@/components/controlled-input";

// Helper component to provide react-hook-form context for tests
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

describe("ControlledInput", () => {
  it("Renders Input And Update Form State On Change", async () => {
    const user = userEvent.setup();
    type FormVals = { username: string };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ username: "" }}>
        <ControlledInput<FormVals> name="username" />
      </TestFormWrapper>,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");

    await user.type(input, "testuser");

    expect(input).toHaveValue("testuser");
  });

  it("Displays Label When Provided", () => {
    type FormVals = { email: string };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ email: "" }}>
        <ControlledInput<FormVals> name="email" label="Email Address" />
      </TestFormWrapper>,
    );

    const label = screen.getByText("Email Address");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  it("Forwards Additional Props To Input Element", () => {
    type FormVals = { password: string };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ password: "" }}>
        <ControlledInput<FormVals>
          name="password"
          placeholder="Enter your password"
        />
      </TestFormWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your password");
    expect(input).toBeInTheDocument();
  });

  it("Displays Validation Error", async () => {
    type FormVals = { myField: string };

    const ErrorWrapper = () => {
      const methods = useForm<FormVals>({ defaultValues: { myField: "" } });

      React.useEffect(() => {
        methods.setError("myField", {
          type: "manual",
          message: "Invalid input",
        });
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <ControlledInput<FormVals> name="myField" />
        </FormProvider>
      );
    };

    render(<ErrorWrapper />);

    const errorMessage = await screen.findByText("Invalid input");
    expect(errorMessage).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("Does Not Render Label When Omitted", () => {
    type FormVals = { field: string };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ field: "" }}>
        <ControlledInput<FormVals> name="field" />
      </TestFormWrapper>,
    );

    const label = screen.queryByRole("label");
    expect(label).not.toBeInTheDocument();
  });

  it("Renders Disabled Input When Prop Is True", () => {
    type FormVals = { field: string };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ field: "" }}>
        <ControlledInput<FormVals> name="field" disabled />
      </TestFormWrapper>,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("Applies Container ClassName", () => {
    type FormVals = { field: string };

    render(
      <TestFormWrapper<FormVals> defaultValues={{ field: "" }}>
        <ControlledInput<FormVals>
          name="field"
          containerClassName="custom-container-class"
        />
      </TestFormWrapper>,
    );

    const input = screen.getByRole("textbox");
    const container = input.parentElement;
    expect(container).toHaveClass("custom-container-class");
    expect(container).toHaveClass("w-full");
  });
});
