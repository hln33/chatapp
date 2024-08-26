import { redirect } from 'next/navigation';
import { verifyUserSession } from '@/lib/session';
import ChatWindow from './_chatbox/chatWindow';

export default async function Home() {
  const isValidSession = await verifyUserSession();
  if (!isValidSession) {
    redirect('/');
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <div className="card bg-gray-800 p-8">
        <ChatWindow />
      </div>
    </main>
  );
}
