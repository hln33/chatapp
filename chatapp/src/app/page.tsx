import Link from 'next/link';
import Login from './_components/login';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <div className="flex flex-col space-y-3 text-center">
        <h1 className="text-xl">Welcome to my chat app</h1>

        <Login />
        <div className="divider divider-neutral" />
        <Link className='link link-hover' href="/register">Sign Up</Link>
      </div>
    </main>
  );
}
