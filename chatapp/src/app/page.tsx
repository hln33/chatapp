export default function Home() {
  fetch('http://localhost:1433')
    .then((res) => res.text())
    .then((text) => console.log(text))
    .catch((e) => console.error(e));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to my chat app</h1>
    </main>
  );
}
