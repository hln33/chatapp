'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { loginUser } from '@/lib/api';
import { FormEvent } from 'react';
import PasswordInput from '@/components/passwordInput';

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const res = await loginUser(username, password);
    if (res?.ok) {
      login(username);
      router.push('/chat');
    }
  };

  return (
    <div className="flex flex-col space-y-3 text-center">
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
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

      <div className="divider divider-neutral" />
      <Link href="/register">Sign Up</Link>
    </div>
  );
}
