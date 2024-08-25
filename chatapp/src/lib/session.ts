import { cookies } from 'next/headers';

export const verifyUserSession = async () => {
  const sessionCookie = cookies().get('session_id');

  console.log(sessionCookie);
};
