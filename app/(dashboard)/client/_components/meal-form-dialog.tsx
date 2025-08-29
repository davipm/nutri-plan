'use client';

import { Session } from 'next-auth';
import { useState } from 'react';

type Props = {
  smallTrigger?: boolean;
  session: Session;
};

export function MealFormDialog({ smallTrigger, session }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p></p>
    </div>
  );
}
