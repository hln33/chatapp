import AccountRegistrationForm from './_components/accountRegistrationForm';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center p-24 space-y-3">
      <h1 className="text-xl">Register for an account</h1>
      <AccountRegistrationForm />
    </main>
  );
}
