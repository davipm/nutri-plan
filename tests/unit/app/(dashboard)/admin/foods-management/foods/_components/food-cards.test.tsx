import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { FoodCards } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards";

// Mock external dependencies
vi.mock("lucide-react", () => ({
  Edit: () => <div data-testid="edit-icon" />,
  Trash: () => <div data-testid="trash-icon" />,
}));

// Mock UI components that aren't the focus of testing
vi.mock("@/components/no-item-found", () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <div data-testid="no-item-found" onClick={onClick}>
      No items found
    </div>
  ),
}));

vi.mock("@/components/pagination", () => ({
  Pagination: ({ currentPage, totalPages, updatePage }: any) => (
    <div data-testid="pagination">
      <button onClick={() => updatePage("prev")}>Previous</button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => updatePage("next")}>Next</button>
      <button onClick={() => updatePage(2)}>Go to page 2</button>
    </div>
  ),
}));

vi.mock(
  "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards-skeleton",
  () => ({
    FoodCardsSkeleton: () => (
      <div data-testid="food-cards-skeleton">Loading...</div>
    ),
  }),
);

vi.mock(
  "@/app/(dashboard)/admin/foods-management/foods/_components/nutritional-info",
  () => ({
    NutritionalInfo: ({ label, value, unit }: any) => (
      <div className={`nutritional-info-${label.toLowerCase()}`}>
        {label}: {value ?? 0} {unit}
      </div>
    ),
  }),
);

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: any) => (
    <div data-testid="alert-dialog">{children}</div>
  ),
  AlertDialogTrigger: ({ children, asChild }: any) => (
    <div data-testid="alert-dialog-trigger">{children}</div>
  ),
  AlertDialogContent: ({ children }: any) => (
    <div data-testid="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({ children }: any) => (
    <div data-testid="alert-dialog-header">{children}</div>
  ),
  AlertDialogTitle: ({ children }: any) => (
    <h2 data-testid="alert-dialog-title">{children}</h2>
  ),
  AlertDialogDescription: ({ children }: any) => (
    <p data-testid="alert-dialog-description">{children}</p>
  ),
  AlertDialogFooter: ({ children }: any) => (
    <div data-testid="alert-dialog-footer">{children}</div>
  ),
  AlertDialogCancel: ({ children }: any) => (
    <button data-testid="alert-dialog-cancel">{children}</button>
  ),
  AlertDialogAction: ({ children, onClick, disabled }: any) => (
    <button
      data-testid="alert-dialog-action"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

// Mock store and query hooks
const mockUseFoodsStore = vi.fn();
const mockUseFoods = vi.fn();
const mockUseDeleteFood = vi.fn();

vi.mock(
  "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store",
  () => ({
    useFoodsStore: () => mockUseFoodsStore(),
  }),
);

vi.mock(
  "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-queries",
  () => ({
    useFoods: () => mockUseFoods(),
  }),
);

vi.mock(
  "@/app/(dashboard)/admin/foods-management/foods/_services/use-food-mutations",
  () => ({
    useDeleteFood: () => mockUseDeleteFood(),
  }),
);

describe("FoodCards", () => {
  const mockUpdateSelectedFoodId = vi.fn();
  const mockUpdateFoodDialogOpen = vi.fn();
  const mockUpdateFoodFilterPage = vi.fn();
  const mockDeleteMutate = vi.fn();
  const mockRefetch = vi.fn();

  const mockFoodData = {
    data: [
      {
        id: 1,
        name: "Apple",
        calories: 95,
        carbohydrates: 25,
        protein: 0.5,
        fat: 0.3,
      },
      {
        id: 2,
        name: "Banana",
        calories: 105,
        carbohydrates: 27,
        protein: 1.3,
        fat: 0.4,
      },
    ],
    totalPages: 2,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Default store mock
    mockUseFoodsStore.mockReturnValue({
      updateSelectedFoodId: mockUpdateSelectedFoodId,
      updateFoodDialogOpen: mockUpdateFoodDialogOpen,
      foodFilters: { page: 1 },
      updateFoodFilterPage: mockUpdateFoodFilterPage,
    });

    // Default query mock
    mockUseFoods.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockFoodData,
    });

    // Default delete mutation mock
    mockUseDeleteFood.mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading skeleton when data is loading", () => {
    mockUseFoods.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    render(<FoodCards />);

    expect(screen.getByTestId("food-cards-skeleton")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display error message with retry button when query fails", () => {
    mockUseFoods.mockReturnValue({
      isLoading: false,
      isError: true,
      isRefetching: false,
      refetch: mockRefetch,
      data: undefined,
    });

    render(<FoodCards />);

    expect(screen.getByText("Failed to load food items")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Try Again"));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("should show retry button as disabled when refetching", () => {
    mockUseFoods.mockReturnValue({
      isLoading: false,
      isError: true,
      isRefetching: true,
      refetch: mockRefetch,
      data: undefined,
    });

    render(<FoodCards />);

    const retryButton = screen.getByText("Retrying...");
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeDisabled();
  });

  it("should show no items found component when no food items exist", () => {
    mockUseFoods.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: [], totalPages: 0 },
    });

    render(<FoodCards />);

    const noItemsComponent = screen.getByTestId("no-item-found");
    expect(noItemsComponent).toBeInTheDocument();

    fireEvent.click(noItemsComponent);
    expect(mockUpdateFoodDialogOpen).toHaveBeenCalledWith(true);
  });

  it("should render food cards with correct nutritional information", () => {
    render(<FoodCards />);

    // Check if food names are rendered
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();

    // Check nutritional information exists (there are multiple instances)
    expect(screen.getByText("Calories: 95 kcal")).toBeInTheDocument();
    expect(screen.getByText("Carbohydrates: 25 g")).toBeInTheDocument();
    expect(screen.getByText("Protein: 0.5 g")).toBeInTheDocument();
    expect(screen.getByText("Fat: 0.3 g")).toBeInTheDocument();

    // Check that separators are rendered
    expect(screen.getAllByTestId("separator")).toHaveLength(2);
  });

  it("should handle edit button click and update store state", async () => {
    const user = userEvent.setup();

    render(<FoodCards />);

    const editButtons = screen.getAllByTestId("edit-icon");
    await user.click(editButtons[0]);

    expect(mockUpdateSelectedFoodId).toHaveBeenCalledWith(1);
    expect(mockUpdateFoodDialogOpen).toHaveBeenCalledWith(true);
  });

  it("should open delete confirmation dialog when delete button is clicked", () => {
    render(<FoodCards />);

    // Check that delete dialogs are rendered
    expect(screen.getAllByTestId("alert-dialog")).toHaveLength(2);
    expect(screen.getAllByTestId("trash-icon")).toHaveLength(2);

    // Check dialog content (there are multiple instances)
    expect(screen.getAllByText("Delete Food Item")).toHaveLength(2);
    expect(screen.getAllByText(/Are you sure you want to delete/)).toHaveLength(
      2,
    );
  });

  it("should call delete mutation when delete is confirmed", async () => {
    const user = userEvent.setup();

    render(<FoodCards />);

    const deleteActions = screen.getAllByTestId("alert-dialog-action");
    await user.click(deleteActions[0]);

    expect(mockDeleteMutate).toHaveBeenCalledWith(1);
  });

  it("should render pagination component with correct props", () => {
    render(<FoodCards />);

    const pagination = screen.getByTestId("pagination");
    expect(pagination).toBeInTheDocument();
    expect(pagination).toHaveTextContent("Page 1 of 2");
  });

  it("should handle pagination page updates correctly", async () => {
    const user = userEvent.setup();

    render(<FoodCards />);

    // Test next page
    await user.click(screen.getByText("Next"));
    expect(mockUpdateFoodFilterPage).toHaveBeenCalledWith("next");

    // Test previous page
    await user.click(screen.getByText("Previous"));
    expect(mockUpdateFoodFilterPage).toHaveBeenCalledWith("prev");

    // Test specific page
    await user.click(screen.getByText("Go to page 2"));
    expect(mockUpdateFoodFilterPage).toHaveBeenCalledWith(2);
  });
});
