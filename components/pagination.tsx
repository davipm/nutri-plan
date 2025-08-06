"use client";

import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div>
      <p></p>
    </div>
  );
}
