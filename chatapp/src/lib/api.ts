import { SERVER_URL } from "./constants";

export const uploadImage = async (formData: FormData): Promise<string[] | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/file_upload`, {
      method: 'POST',
      body: formData,
    });

    const imageURLs: string[] = JSON.parse(await res.text());
    console.log(imageURLs);

    return imageURLs;
  } catch (err) {
    console.error('Error uploading image', err);
  }

  return null;
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${SERVER_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  console.log(res);
  console.log(await res.text());

  return res;
}