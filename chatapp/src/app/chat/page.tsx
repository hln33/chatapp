import { redirect } from 'next/navigation';
import { verifyUserSession } from '@/lib/session';
import ChatWindow from './_chatbox/chatWindow';

export default async function Home() {
  const isValidSession = await verifyUserSession();
  if (!isValidSession) {
    redirect('/');
  }

  return (
    <main className="h-full flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Welcome to my chat app</h1>

      <div className="card bg-gray-800 p-8">
        <ChatWindow />
      </div>
    </main>
  );
}
