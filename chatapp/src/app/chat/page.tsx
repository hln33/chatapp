import { redirect } from 'next/navigation';
import { verifyUserSession } from '@/lib/session';
import ChatWindow from './_components/chatWindow';

export default async function Home() {
  const isValidSession = await verifyUserSession();
  if (!isValidSession) {
    redirect('/');
  }

  return (
    <main className="flex flex-col items-center justify-center p-11 space-y-3">
      <div className="card bg-gray-800 p-8">
        <ChatWindow />
      </div>
    </main>
  );
}
