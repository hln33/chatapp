import Link from 'next/link';
import Login from './_components/login';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center space-y-3">
      <div className="flex flex-col space-y-3 text-center w-72">
        <h1 className="text-xl">Welcome to my chat app</h1>

        <Login />
        <div className="divider" />
        <Link className="link link-hover" href="/register">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
