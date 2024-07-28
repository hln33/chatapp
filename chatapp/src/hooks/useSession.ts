import { SERVER_URL } from "@/lib/constants";
import { useEffect } from "react";

export default function useSession() {
  useEffect(() => {
    // get session cookie
    fetch(`${SERVER_URL}/session`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);
}