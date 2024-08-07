'use client';

import Login from './_login/login';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Welcome to my chat app</h1>
      <Login />
    </main>
  );
}
