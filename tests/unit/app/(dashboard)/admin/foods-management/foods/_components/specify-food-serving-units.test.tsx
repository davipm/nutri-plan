import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpecifyFoodServingUnits } from "@/app/(dashboard)/admin/foods-management/foods/_components/specify-food-serving-units";

// Mock the external dependencies
vi.mock("react-hook-form", () => ({
  useFormContext: vi.fn(),
  useFieldArray: vi.fn(),
}));

vi.mock(
  "@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries",
  () => ({
    useServingUnits: vi.fn(),
  }),
);

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/controlled-select", () => ({
  ControlledSelect: ({ name, label, placeholder, options }: any) => (
    <div data-testid={`controlled-select-${name}`}>
      <label>{label}</label>
      <select data-testid={`select-${name}`}>
        <option value="">{placeholder}</option>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock("@/components/controlled-input", () => ({
  ControlledInput: ({ name, label, type, placeholder }: any) => (
    <div data-testid={`controlled-input-${name}`}>
      <label>{label}</label>
      <input
        data-testid={`input-${name}`}
        type={type}
        placeholder={placeholder}
      />
    </div>
  ),
}));

vi.mock(
  "@/app/(dashboard)/admin/foods-management/serving-units/_components/serving-unit-form-dialog",
  () => ({
    ServingUnitFormDialog: ({ smallTrigger }: any) => (
      <div data-testid="serving-unit-form-dialog">
        {smallTrigger && <span>Small Trigger</span>}
      </div>
    ),
  }),
);

vi.mock("lucide-react", () => ({
  CirclePlus: () => <span data-testid="circle-plus-icon">+</span>,
  UtensilsCrossed: () => <span data-testid="utensils-crossed-icon">🍴</span>,
  Trash2: () => <span data-testid="trash2-icon">🗑️</span>,
}));

// Import the mocked modules
import { useFormContext, useFieldArray } from "react-hook-form";
import { useServingUnits } from "@/app/(dashboard)/admin/foods-management/serving-units/_services/use-queries";

describe("Specify Food Serving Units", () => {
  const mockAppend = vi.fn();
  const mockRemove = vi.fn();
  const mockControl = {};

  const mockServingUnitsData = [
    { id: "1", name: "Cup" },
    { id: "2", name: "Tablespoon" },
    { id: "3", name: "Piece" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useFormContext
    (useFormContext as any).mockReturnValue({
      control: mockControl,
    });

    // Mock useFieldArray
    (useFieldArray as any).mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
    });

    // Mock useServingUnits
    (useServingUnits as any).mockReturnValue({
      data: mockServingUnitsData,
      isLoading: false,
      error: null,
    });
  });

  it("Should Render Component With Proper Heading And Add Button", () => {
    render(<SpecifyFoodServingUnits />);

    expect(screen.getByText("Serving Units")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add serving unit/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("circle-plus-icon")).toBeInTheDocument();
  });

  it("Should Display Empty State When No Serving Units Are Added", () => {
    render(<SpecifyFoodServingUnits />);

    expect(screen.getByTestId("utensils-crossed-icon")).toBeInTheDocument();
    expect(screen.getByText("No serving units added yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add serving units to help users measure this food"),
    ).toBeInTheDocument();
  });

  it("Should Add New Serving Unit When Add Button Is Clicked", async () => {
    const user = userEvent.setup();
    render(<SpecifyFoodServingUnits />);

    const addButton = screen.getByRole("button", { name: /add serving unit/i });
    await user.click(addButton);

    expect(mockAppend).toHaveBeenCalledWith({
      foodServingUnitId: "",
      grams: "0",
    });
  });

  it("Should Remove Serving Unit When Remove Button Is Clicked", async () => {
    const user = userEvent.setup();

    // Mock fields with one serving unit
    (useFieldArray as any).mockReturnValue({
      fields: [{ id: "field-1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<SpecifyFoodServingUnits />);

    // Find the remove button by looking for the trash icon
    const removeButton = screen.getByTestId("trash2-icon").closest("button");
    await user.click(removeButton!);

    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it("Should Render Serving Unit Fields With Proper Form Controls", () => {
    // Mock fields with one serving unit
    (useFieldArray as any).mockReturnValue({
      fields: [{ id: "field-1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<SpecifyFoodServingUnits />);

    expect(
      screen.getByTestId(
        "controlled-select-foodServingUnits.0.foodServingUnitId",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("controlled-input-foodServingUnits.0.grams"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("serving-unit-form-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("trash2-icon")).toBeInTheDocument();
  });

  it("Should Handle Serving Units Query Loading State", () => {
    (useServingUnits as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    // Mock fields with one serving unit
    (useFieldArray as any).mockReturnValue({
      fields: [{ id: "field-1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<SpecifyFoodServingUnits />);

    // Component should still render but with no options
    expect(
      screen.getByTestId(
        "controlled-select-foodServingUnits.0.foodServingUnitId",
      ),
    ).toBeInTheDocument();
  });

  it("Should Handle Serving Units Query Error State", () => {
    (useServingUnits as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
    });

    // Mock fields with one serving unit
    (useFieldArray as any).mockReturnValue({
      fields: [{ id: "field-1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<SpecifyFoodServingUnits />);

    // Component should still render but with no options
    expect(
      screen.getByTestId(
        "controlled-select-foodServingUnits.0.foodServingUnitId",
      ),
    ).toBeInTheDocument();
  });

  it("Should Populate Select Options From Serving Units Data", () => {
    // Mock fields with one serving unit
    (useFieldArray as any).mockReturnValue({
      fields: [{ id: "field-1" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<SpecifyFoodServingUnits />);

    const select = screen.getByTestId(
      "select-foodServingUnits.0.foodServingUnitId",
    );

    expect(select).toBeInTheDocument();
    expect(screen.getByText("Cup")).toBeInTheDocument();
    expect(screen.getByText("Tablespoon")).toBeInTheDocument();
    expect(screen.getByText("Piece")).toBeInTheDocument();
  });

  it("Should Render Multiple Serving Units Correctly", () => {
    // Mock fields with multiple serving units
    (useFieldArray as any).mockReturnValue({
      fields: [{ id: "field-1" }, { id: "field-2" }, { id: "field-3" }],
      append: mockAppend,
      remove: mockRemove,
    });

    render(<SpecifyFoodServingUnits />);

    // Should render 3 sets of form controls
    expect(
      screen.getByTestId(
        "controlled-select-foodServingUnits.0.foodServingUnitId",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "controlled-select-foodServingUnits.1.foodServingUnitId",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "controlled-select-foodServingUnits.2.foodServingUnitId",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("controlled-input-foodServingUnits.0.grams"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("controlled-input-foodServingUnits.1.grams"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("controlled-input-foodServingUnits.2.grams"),
    ).toBeInTheDocument();

    // Should render 3 remove buttons
    const removeButtons = screen.getAllByTestId("trash2-icon");
    expect(removeButtons).toHaveLength(3);
  });

  it("Should Maintain Proper Form Field Array Structure", () => {
    render(<SpecifyFoodServingUnits />);

    // Verify useFieldArray was called with correct parameters
    expect(useFieldArray).toHaveBeenCalledWith({
      control: mockControl,
      name: "foodServingUnits",
    });
  });
});
