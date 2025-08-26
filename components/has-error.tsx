import { Button } from '@/components/ui/button';

type Props = {
  refetch: () => void;
  isRefetching: boolean;
};

export function HasError({ isRefetching, refetch }: Props) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center space-y-4 py-12">
      <p>Failed to load serving units</p>
      <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
        {isRefetching ? 'Retrying...' : 'Try Again'}
      </Button>
    </div>
  );
}
