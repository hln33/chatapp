import PasswordInput from '@/components/passwordInput';
import { createUser } from '@/lib/api';
import { redirect } from 'next/navigation';

export default function Home() {
  const createUserAction = async (formData: FormData) => {
    'use server';
    console.log(formData);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    if (username && password) {
      const res = await createUser(username, password);
      console.log(res);
      if (res?.ok) {
        redirect('/');
      }
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Register for an account</h1>

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
    </main>
  );
}
