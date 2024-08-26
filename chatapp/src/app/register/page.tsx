import PasswordInput from '@/components/passwordInput';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Register for an account</h1>

      <form className="flex flex-col space-y-3">
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
