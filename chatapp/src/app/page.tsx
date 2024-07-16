import ChatBox from './chatbox';

export default function Home() {
  // test get request to websocket server
  // no-cache for testing purposes
  // fetch('http://localhost:3001/hello', { cache: 'no-cache' })
  //   .then((res) => res.text())
  //   .then((text) => console.log(text))
  //   .catch((e) => console.error(e));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to my chat app</h1>
      <ChatBox />
    </main>
  );
}
