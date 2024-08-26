import { cookies } from 'next/headers';
import { SERVER_URL } from './constants';

export const verifyUserSession = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${SERVER_URL}/check_session`, {
      headers: { Cookie: cookies().toString() },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('session verification failed.', res);
    }

    return res.ok;
  } catch (err) {
    console.error('error validating session:', err);
    return false;
  }
};
