import { useEffect } from "react";

const SOCKET_SERVER_URL = 'http://localhost:3001';

export default function useSession() {
  useEffect(() => {
    // get session cookie
    fetch(`${SOCKET_SERVER_URL}/session`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);
}