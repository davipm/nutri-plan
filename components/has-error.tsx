'use client';

import { Button } from '@/components/ui/button';

type Props = {
  refetchAction: () => void;
  isRefetching: boolean;
  message?: string;
};

export function HasError({ isRefetching, refetchAction, message = 'Failed to load data' }: Props) {
  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="flex flex-col items-center justify-center space-y-4 py-12"
    >
      <p>{message}</p>
      <Button
        variant="outline"
        onClick={refetchAction}
        disabled={isRefetching}
        aria-label="Retry fetching data"
      >
        {isRefetching ? 'Retrying...' : 'Try Again'}
      </Button>
    </div>
  );
}
