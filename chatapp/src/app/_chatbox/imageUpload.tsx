import { ChangeEvent, useState } from 'react';
import Image from 'next/image';

const uploadImage = async (formData: FormData): Promise<string | null> => {
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

type Props = {
  // eslint-disable-next-line no-unused-vars
  onImageUpload: (imageURL: string) => void;
};

export default function ImageUpload({ onImageUpload }: Props) {
  const [imageURL, setImageURL] = useState('');

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const serverImageURL = await uploadImage(formData);
    if (serverImageURL) {
      onImageUpload(serverImageURL);
    }

    const imageURL = URL.createObjectURL(file);
    setImageURL(imageURL);
  };

  return (
    <>
      {imageURL && (
        <Image
          className="w-auto h-auto"
          src={imageURL}
          width={0}
          height={0}
          alt="preview"
        />
      )}
      <input type="file" onChange={handleImageChange} />
    </>
  );
}
