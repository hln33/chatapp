import ChatBox from './_chatbox/chatbox';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-24 space-y-3">
      <h1>Welcome to my chat app</h1>
      <ChatBox />
    </main>
  );
}
