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