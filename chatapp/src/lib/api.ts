import { SERVER_URL } from './constants';

export const uploadImage = async (
  formData: FormData
): Promise<string[] | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/file_upload`, {
      method: 'POST',
      body: formData,
    });

    const imageURLs: string[] = JSON.parse(await res.text());
    return imageURLs;
  } catch (err) {
    console.error('Error uploading image', err);
    return null;
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<Response | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return res;
  } catch (err) {
    console.error('Error logging in:', err);
    return null;
  }
};

export const createUser = async (
  username: string,
  password: string
): Promise<Response | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/create_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return res;
  } catch (err) {
    console.error('Error creating user:', err);
    return null;
  }
};
