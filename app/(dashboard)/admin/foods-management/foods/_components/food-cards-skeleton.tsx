'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A functional React component that generates a skeleton loading UI for a grid of food item cards. This skeleton serves as a placeholder while actual content is being loaded.
 *
 * @return A JSX element representing a collection of skeleton cards, including loading indicators styled as placeholder elements.
 */
export function FoodCardsSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-7">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-1">
          <Skeleton className="size-6" />
          <Skeleton className="size-6" />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Skeleton className="mb-1 h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
