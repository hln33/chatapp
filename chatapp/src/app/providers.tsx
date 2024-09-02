'use client';

import { UserProvider } from '@/context/userContext';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export function Providers({ children }: Props) {
  /*
   * can do an auth check here.
   * if the auth check succeeds and returns user info, we can use that to set the userContext
   */

  return <UserProvider>{children}</UserProvider>;
}
