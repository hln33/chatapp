'use client';

import { UserProvider } from '@/context/userContext';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export function Providers({ children }: Props) {
  return <UserProvider>{children}</UserProvider>;
}
