export const uploadImage = async (formData: FormData): Promise<string | null> => {
  try {
    const res = await fetch('http://localhost:3001/file_upload', {
      method: 'POST',
      body: formData,
    });

    const imageURL = await res.text();
    console.log(imageURL);

    return imageURL;
  } catch (err) {
    console.error('Error uploading image', err);
  }

  return null;
};