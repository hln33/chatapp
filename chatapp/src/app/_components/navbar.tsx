'use client'

import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

// still in development!
export default function NavBar() {
  const router = useRouter();
  const {user, logout} = useUser();

  console.log(user);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="navbar bg-neutral rounded-box flex justify-end px-12">
      <a className="btn btn-ghost">test</a>
      <a className="btn btn-ghost" onClick={handleLogout}>logout</a>
    </div>
  );
}
