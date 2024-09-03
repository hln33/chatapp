'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { loginUser } from '@/lib/api';
import AuthForm from '@/components/authForm';

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const loginUserAction = async (username: string, password: string) => {
    const res = await loginUser(username, password);
    if (res?.ok) {
      login(username);
      router.push('/chat');
    } else {
      throw Error(await res?.text());
    }
  };

  return <AuthForm onSubmit={loginUserAction} submitButtonText="Login" />;
}
