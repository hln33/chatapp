import ChatBox from './_chatbox/chatbox';

export default function Home() {
  // test get request to websocket server
  // no-cache for testing purposes
  // fetch('http://localhost:3001/hello', { cache: 'no-cache' })
  //   .then((res) => res.text())
  //   .then((text) => console.log(text))
  //   .catch((e) => console.error(e));

  return (
    <main className="flex flex-col items-center justify-center p-24 space-y-3">
      <h1>Welcome to my chat app</h1>
      <ChatBox />
    </main>
  );
}
