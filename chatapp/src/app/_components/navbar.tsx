'use client';

import { useUser } from '@/context/userContext';
import { useRouter } from 'next/navigation';

// still in development!
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
      <div className="navbar flex justify-end border-b border-gray-800">
        <a className="btn btn-ghost" onClick={handleLogout}>
          logout
        </a>
      </div>
    </>
  );
}
