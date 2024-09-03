'use client';

import { useState } from 'react';
import PasswordInput from './passwordInput';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (username: string, password: string) => Promise<void>;
  submitButtonText: string;
};

export default function AuthForm({ onSubmit, submitButtonText }: Props) {
  const [error, setError] = useState<string | null>(null);

  const formAction = async (formData: FormData) => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    if (!username || !password) return;

    try {
      await onSubmit(username, password);
    } catch (err: any) {
      setError(err.message ?? 'Unknown Error');
    }
  };

  return (
    <>
      {error && <p className="text-red-400">{error}</p>}
      <form className="flex flex-col space-y-3" action={formAction}>
        <input
          className="input input-bordered text-center"
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <PasswordInput />

        <button className="btn bg-cyan-400 text-white" type="submit">
          {submitButtonText}
        </button>
      </form>
    </>
  );
}
