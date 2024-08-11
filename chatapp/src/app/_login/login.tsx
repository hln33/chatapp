'use client';

import { useUser } from '@/context/userContext';
import { loginUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const { login } = useUser();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
      <input
        className="input input-bordered text-center"
        type="text"
        name="username"
        placeholder="Username"
        required
      />

      <div className="relative">
        <input
          className="input input-bordered text-center"
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? '👁️' : '🙈'}
        </button>
      </div>

      <button className="btn bg-cyan-400 text-white" type="submit">
        Login
      </button>
    </form>
  );
}
