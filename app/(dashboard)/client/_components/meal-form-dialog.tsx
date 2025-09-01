'use client';

import { useSession } from 'next-auth/react';

type Props = {
  smallTrigger?: boolean;
};

export function MealFormDialog({ smallTrigger }: Props) {
  const { data } = useSession();
  console.log({ data, smallTrigger });

  return (
    <div>
      <p></p>
    </div>
  );
}
