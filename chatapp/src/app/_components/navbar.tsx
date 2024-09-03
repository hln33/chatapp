'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

export default function NavBar() {
  const router = useRouter();
  const { user, logout } = useUser();

  console.log(user);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <div className="navbar py-0">
        <Image src="/message.svg" alt="message bubble" width={50} height={50} />
        {user && (
          <a className="btn btn-ghost ml-auto h-full" onClick={handleLogout}>
            logout
          </a>
        )}
      </div>
      <div className="divider m-0" />
    </>
  );
}
