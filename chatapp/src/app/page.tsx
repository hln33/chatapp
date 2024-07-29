import ChatBox from './_chatbox/chatbox';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Welcome to my chat app</h1>

      <div className="card bg-gray-800 p-8">
        <ChatBox />
      </div>
    </main>
  );
}
