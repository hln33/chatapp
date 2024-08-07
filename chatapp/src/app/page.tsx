'use client';

import useChatSocket from '@/hooks/useChatSocket';
import ChatBox from './_chatbox/chatbox';
import Login from './_login/login';

export default function Home() {
  const { messages, sendMessage } = useChatSocket();

  return (
    <main className="h-full flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Welcome to my chat app</h1>

      <Login />

      {/* <div className="card bg-gray-800 p-8">
        <ChatBox messages={messages} sendMessage={sendMessage} />
      </div> */}
    </main>
  );
}
