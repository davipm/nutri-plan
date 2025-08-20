import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FoodCardsSkeleton } from "@/app/(dashboard)/admin/foods-management/foods/_components/food-cards-skeleton";

// Mock the UI components
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className, ...props }: any) => (
    <div data-testid="skeleton" className={className} {...props} />
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: (props: any) => (
    <hr data-testid="separator" {...props} />
  ),
}));

describe("Food Cards Skeleton", () => {
  it("Should Render Exactly 12 Skeleton Cards", () => {
    render(<FoodCardsSkeleton />);

    // Count the number of card containers
    const cardContainers = screen.getAllByRole("generic").filter(element =>
      element.className.includes("flex flex-col gap-3 rounded-lg border p-7")
    );

    expect(cardContainers).toHaveLength(12);
  });

  it("Should Render Skeleton Elements With Correct CSS Classes For Styling", () => {
    render(<FoodCardsSkeleton />);

    // Check for specific skeleton elements with their expected classes
    const titleSkeletons = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("h-5 w-24")
    );
    expect(titleSkeletons).toHaveLength(12); // One per card

    const actionSkeletons = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("size-6")
    );
    expect(actionSkeletons).toHaveLength(24); // Two per card (12 cards × 2)

    const labelSkeletons = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("mb-1 h-4")
    );
    expect(labelSkeletons).toHaveLength(48); // Four per card (12 cards × 4)

    const valueSkeletons = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("h-4 w-12") && !element.className.includes("mb-1")
    );
    expect(valueSkeletons).toHaveLength(48); // Four per card (12 cards × 4)
  });

  it("Should Display Proper Card Structure With Header Separator And Grid Layout", () => {
    render(<FoodCardsSkeleton />);

    // Check for separators (one per card)
    const separators = screen.getAllByTestId("separator");
    expect(separators).toHaveLength(12);

    // Check for grid containers with proper classes
    const gridContainers = screen.getAllByRole("generic").filter(element =>
      element.className.includes("grid grid-cols-2 gap-5")
    );
    expect(gridContainers).toHaveLength(12);

    // Check for header sections with justify-between
    const headerSections = screen.getAllByRole("generic").filter(element =>
      element.className.includes("flex justify-between")
    );
    expect(headerSections).toHaveLength(12);
  });

  it("Should Render Action Buttons Placeholders (2 Skeleton Buttons Per Card)", () => {
    render(<FoodCardsSkeleton />);

    // Check for action button containers
    const actionContainers = screen.getAllByRole("generic").filter(element =>
      element.className.includes("flex gap-1")
    );
    expect(actionContainers).toHaveLength(12);

    // Check for action button skeletons (size-6 class indicates button-sized skeletons)
    const actionButtonSkeletons = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("size-6")
    );
    expect(actionButtonSkeletons).toHaveLength(24); // 2 per card × 12 cards
  });

  it("Should Render Nutritional Info Grid With 4 Skeleton Sections Per Card", () => {
    render(<FoodCardsSkeleton />);

    // Each card should have 4 nutritional info sections in the grid
    const nutritionalSections = screen.getAllByRole("generic").filter(element =>
      element.parentElement?.className.includes("grid grid-cols-2 gap-5") &&
      !element.className.includes("grid")
    );
    expect(nutritionalSections).toHaveLength(48); // 4 per card × 12 cards

    // Each nutritional section should have a label skeleton (mb-1 h-4)
    const nutritionalLabels = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("mb-1 h-4")
    );
    expect(nutritionalLabels).toHaveLength(48);

    // Each nutritional section should have a value skeleton (h-4 w-12 without mb-1)
    const nutritionalValues = screen.getAllByTestId("skeleton").filter(element =>
      element.className.includes("h-4 w-12") && !element.className.includes("mb-1")
    );
    expect(nutritionalValues).toHaveLength(48);
  });
});
