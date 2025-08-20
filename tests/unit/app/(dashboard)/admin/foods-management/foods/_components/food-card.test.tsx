import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import {
  FoodCard,
  FoodData,
} from "@/app/(dashboard)/admin/foods-management/foods/_components/food-card";
import { UseMutationResult } from "@tanstack/react-query";

// Mock external dependencies
vi.mock("lucide-react", () => ({
  Edit: () => <div data-testid="edit-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
}));

// Mock UI components
vi.mock("@/components/ui/button", () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  Button: ({ children, onClick, disabled, ...props }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: never) => (
    <div data-testid="alert-dialog">{children}</div>
  ),
  AlertDialogTrigger: ({ children }: never) => (
    <div data-testid="alert-dialog-trigger">{children}</div>
  ),
  AlertDialogContent: ({ children }: never) => (
    <div data-testid="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: never) => (
    <div data-testid="alert-dialog-header">{children}</div>
  ),
  AlertDialogTitle: ({ children }: never) => (
    <h2 data-testid="alert-dialog-title">{children}</h2>
  ),
  AlertDialogDescription: ({ children }: never) => (
    <p data-testid="alert-dialog-description">{children}</p>
  ),
  AlertDialogFooter: ({ children }: never) => (
    <div data-testid="alert-dialog-footer">{children}</div>
  ),
  AlertDialogCancel: ({ children }: never) => (
    <button data-testid="alert-dialog-cancel">{children}</button>
  ),
  AlertDialogAction: ({ children, onClick, disabled }: never) => (
    <button
      data-testid="alert-dialog-action"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock(
  "@/app/(dashboard)/admin/foods-management/foods/_components/nutritional-info",
  () => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    NutritionalInfo: ({ label, value, unit }) => (
      <div data-testid={`nutritional-info-${label.toLowerCase()}`}>
        {label}: {value ?? 0} {unit}
      </div>
    ),
  }),
);

describe("FoodCard", () => {
  const mockOnEdit = vi.fn();
  const mockMutate = vi.fn();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const mockFoodItem: FoodData = {
    id: 1,
    name: "Apple",
    calories: 95,
    carbohydrates: 25,
    protein: 0.5,
    fat: 0.3,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const mockDeleteFoodMutation: UseMutationResult<
    void,
    Error,
    number,
    unknown
  > = {
    mutate: mockMutate,
    variables: undefined,
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render food item name correctly", () => {
    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("should display all nutritional information", () => {
    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByTestId("nutritional-info-calories")).toHaveTextContent(
      "Calories: 95 kcal",
    );
    expect(
      screen.getByTestId("nutritional-info-carbohydrates"),
    ).toHaveTextContent("Carbohydrates: 25 g");
    expect(screen.getByTestId("nutritional-info-protein")).toHaveTextContent(
      "Protein: 0.5 g",
    );
    expect(screen.getByTestId("nutritional-info-fat")).toHaveTextContent(
      "Fat: 0.3 g",
    );
  });

  it("should call onEdit callback when edit button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    const editButton = screen.getByTestId("edit-icon").closest("button");
    await user.click(editButton!);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("should show delete confirmation dialog when delete button is clicked", () => {
    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-title")).toHaveTextContent(
      "Delete Food Item",
    );
    expect(screen.getByTestId("alert-dialog-description")).toHaveTextContent(
      /Are you sure you want to delete.*Apple.*\? This action cannot be undone\./,
    );
  });

  it("should call delete mutation when delete is confirmed", async () => {
    const user = userEvent.setup();

    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    const deleteAction = screen.getByTestId("alert-dialog-action");
    await user.click(deleteAction);

    expect(mockMutate).toHaveBeenCalledWith(1);
  });

  it("should show 'Deleting...' text when deletion is in progress", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const pendingMutation: UseMutationResult<void, Error, number, unknown> = {
      ...mockDeleteFoodMutation,
      isPending: true,
      variables: 1,
    };

    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={pendingMutation}
      />,
    );

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  it("should disable delete button during deletion process", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const pendingMutation: UseMutationResult<void, Error, number, unknown> = {
      ...mockDeleteFoodMutation,
      isPending: true,
      variables: 1,
    };

    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={pendingMutation}
      />,
    );

    const deleteAction = screen.getByTestId("alert-dialog-action");
    expect(deleteAction).toBeDisabled();
  });

  it("should handle null nutritional values gracefully", () => {
    const foodItemWithNulls = {
      ...mockFoodItem,
      calories: null,
      carbohydrates: null,
      protein: null,
      fat: null,
    };

    render(
      <FoodCard
        item={foodItemWithNulls}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByTestId("nutritional-info-calories")).toHaveTextContent(
      "Calories: 0 kcal",
    );
    expect(
      screen.getByTestId("nutritional-info-carbohydrates"),
    ).toHaveTextContent("Carbohydrates: 0 g");
    expect(screen.getByTestId("nutritional-info-protein")).toHaveTextContent(
      "Protein: 0 g",
    );
    expect(screen.getByTestId("nutritional-info-fat")).toHaveTextContent(
      "Fat: 0 g",
    );
  });

  it("should render edit and delete buttons with correct icons", () => {
    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
  });

  it("should display proper dialog content with food name in confirmation", () => {
    const customFoodItem = {
      ...mockFoodItem,
      name: "Custom Food Item",
    };

    render(
      <FoodCard
        item={customFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByTestId("alert-dialog-description")).toHaveTextContent(
      /Are you sure you want to delete.*Custom Food Item.*\? This action cannot be undone\./,
    );
  });

  it("should render separator component", () => {
    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={mockDeleteFoodMutation}
      />,
    );

    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("should not show deleting state for different food item", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const pendingMutation: UseMutationResult<void, Error, number, unknown> = {
      ...mockDeleteFoodMutation,
      isPending: true,
      variables: 2, // Different ID
    };

    render(
      <FoodCard
        item={mockFoodItem}
        onEdit={mockOnEdit}
        deleteFoodMutation={pendingMutation}
      />,
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.queryByText("Deleting...")).not.toBeInTheDocument();

    const deleteAction = screen.getByTestId("alert-dialog-action");
    expect(deleteAction).not.toBeDisabled();
  });
});
