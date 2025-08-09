"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number | undefined;
  updatePage: (action: "next" | "prev" | number) => void;
  className?: string;
  scrollToTopOnPaginate?: boolean;
};

export function Pagination({
  currentPage,
  totalPages,
  updatePage,
  className,
  scrollToTopOnPaginate = true,
}: PaginationProps) {
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (scrollToTopOnPaginate && prevPageRef.current !== currentPage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    prevPageRef.current = currentPage;
  }, [currentPage, scrollToTopOnPaginate]);

  if (totalPages === undefined) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    );
  }

  /**
   * Generates an array representing pagination based on the total number of pages and the current page.
   * The pagination includes logical ellipsis placeholders where appropriate for large numbers of pages.
   *
   * Rules for pagination generation:
   * - If the total number of pages is less than or equal to 7, all pages are included without any ellipsis.
   * - If the current page is within the first four pages, the output includes the first five pages, an ellipsis, and the last page.
   * - If the current page is within the last four pages, the output includes the first page, an ellipsis, and the last five pages.
   * - For all other cases, the output includes the first page, an ellipsis, the current page (with its adjacent pages), another ellipsis, and the last page.
   *
   * @function
   * @param {number} totalPages - The total number of pages available.
   * @param {number} currentPage - The current page number.
   * @returns An array representing pagination. Page numbers are represented as numbers, while ellipsis placeholders are represented as the string "ellipsis".
   */
  const generatePagination = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage < 5) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    if (currentPage > totalPages - 4) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const pages = generatePagination();

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            onClick={() => updatePage("prev")}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 px-2.5 sm:pl-2.5",
              currentPage === 1 && "pointer-events-none opacity-50",
            )}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </button>
        </li>

        {pages.map((page, index) => (
          <li key={`${page}-${index}`} data-slot="pagination-ellipses">
            {page === "ellipsis" ? (
              <span
                aria-hidden
                data-slot="pagination-ellipsis"
                className="flex size-9 items-center justify-center"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <button
                onClick={() => updatePage(page as number)}
                aria-current={currentPage === page ? "page" : undefined}
                data-active={currentPage === page}
                className={cn(
                  buttonVariants({
                    variant: currentPage === page ? "outline" : "ghost",
                    size: "icon",
                  }),
                )}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={() => updatePage("next")}
            disabled={currentPage === totalPages || !totalPages}
            aria-label="Go to next page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 px-2.5 sm:pr-2.5",
              (currentPage === totalPages || !totalPages) &&
                "pointer-events-none opacity-50",
            )}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
}
