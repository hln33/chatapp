'use client';

import PasswordInput from '@/components/passwordInput';
import { createUser } from '@/lib/api';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function AccountRegistrationForm() {
  const [error, setError] = useState<string | null>(null);

  const createUserAction = async (formData: FormData) => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    if (username && password) {
      const res = await createUser(username, password);
      console.log(res);
      if (res?.ok) {
        redirect('/');
      } else {
        // TODO: should display error from server here
        setError('problem with creating account');
      }
    }
  };

  return (
    <>
      {error && <p className="text-red-400">{error}</p>}
      <form className="flex flex-col space-y-3" action={createUserAction}>
        <input
          className="input input-bordered text-center"
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <PasswordInput />
        <button className="btn bg-cyan-400 text-white" type="submit">
          Sign Up
        </button>
      </form>
    </>
  );
}
