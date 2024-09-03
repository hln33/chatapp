'use client';

import { createUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/authForm';

export default function AccountRegistrationForm() {
  const router = useRouter();

  const createUserAction = async (username: string, password: string) => {
    const res = await createUser(username, password);
    if (res?.ok) {
      router.push('/');
    } else {
      throw Error(await res?.text());
    }
  };

  return <AuthForm onSubmit={createUserAction} submitButtonText="Sign Up" />;
}
