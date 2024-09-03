'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { loginUser } from '@/lib/api';
import PasswordInput from '@/components/passwordInput';

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const loginUserAction = async (formData: FormData) => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const res = await loginUser(username, password);
    if (res?.ok) {
      login(username);
      router.push('/chat');
    }
  };

  return (
    <form className="flex flex-col space-y-3" action={loginUserAction}>
      <input
        className="input input-bordered text-center"
        type="text"
        name="username"
        placeholder="Username"
        required
      />
      <PasswordInput />

      <button className="btn bg-cyan-400 text-white" type="submit">
        Login
      </button>
    </form>
  );
}
