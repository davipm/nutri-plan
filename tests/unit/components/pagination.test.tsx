import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Pagination } from "@/components/pagination";

// Mock the Skeleton component as it's not the subject of this test
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: React.ComponentProps<"div">) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

const scrollToMock = vi.fn();

describe("Pagination", () => {
  beforeEach(() => {
    // Mock window.scrollTo for testing scroll behavior
    Object.defineProperty(window, "scrollTo", {
      value: scrollToMock,
      writable: true,
    });
  });

  afterEach(() => {
    // Clear all mocks after each test to ensure isolation
    vi.clearAllMocks();
  });

  it("scrolls to top on page change by default", () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} updatePage={vi.fn()} />,
    );

    expect(scrollToMock).not.toHaveBeenCalled();

    rerender(
      <Pagination currentPage={2} totalPages={5} updatePage={vi.fn()} />,
    );

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });

  it("displays skeleton loader when total pages is undefined", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={undefined}
        updatePage={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("navigation", { name: "pagination" }),
    ).not.toBeInTheDocument();
  });

  it("prevents scrolling when prop is false", () => {
    const { rerender } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        updatePage={vi.fn()}
        scrollToTopOnPaginate={false}
      />,
    );

    rerender(
      <Pagination
        currentPage={2}
        totalPages={5}
        updatePage={vi.fn()}
        scrollToTopOnPaginate={false}
      />,
    );

    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("applies 'aria-current=\"page\"' attribute exclusively to the button for the current page", () => {
    render(<Pagination currentPage={3} totalPages={5} updatePage={vi.fn()} />);

    const currentPageButton = screen.getByRole("button", { name: "3" });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");

    const otherPageButton = screen.getByRole("button", { name: "2" });
    expect(otherPageButton).not.toHaveAttribute("aria-current");

    const anotherPageButton = screen.getByRole("button", { name: "4" });
    expect(anotherPageButton).not.toHaveAttribute("aria-current");
  });

  it("renders the current page button with a distinct visual style to differentiate it from other page buttons", () => {
    render(<Pagination currentPage={3} totalPages={5} updatePage={vi.fn()} />);

    // The active button should have the 'outline' variant, which includes the 'border' class.
    const currentPageButton = screen.getByRole("button", { name: "3" });
    expect(currentPageButton).toHaveClass("border");

    // Inactive buttons should have the 'ghost' variant, which does not have the 'border' class.
    const otherPageButton = screen.getByRole("button", { name: "2" });
    expect(otherPageButton).not.toHaveClass("border");
  });

  it("hides the 'Previous' and 'Next' text labels on small viewports", () => {
    render(<Pagination currentPage={2} totalPages={5} updatePage={vi.fn()} />);

    const previousText = screen.getByText("Previous");
    expect(previousText).toHaveClass("hidden", "sm:block");

    const nextText = screen.getByText("Next");
    expect(nextText).toHaveClass("hidden", "sm:block");
  });

  it("does not render any ellipsis icons when the total number of pages is small enough to display all page numbers", () => {
    render(<Pagination currentPage={3} totalPages={5} updatePage={vi.fn()} />);

    expect(screen.queryByText("More pages")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("does not trigger a scroll to the top if the component re-renders without a change in the 'currentPage' prop", () => {
    const { rerender } = render(
      <Pagination currentPage={2} totalPages={5} updatePage={vi.fn()} />,
    );

    expect(scrollToMock).not.toHaveBeenCalled();

    rerender(
      <Pagination currentPage={2} totalPages={5} updatePage={vi.fn()} />,
    );

    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
