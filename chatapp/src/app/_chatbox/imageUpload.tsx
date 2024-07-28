import { ChangeEvent, useState } from 'react';
import Image from 'next/image';

const uploadImage = async (formData: FormData) => {
  try {
    const res = await fetch('http://localhost:3001/file_upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.text();
    console.log(data);
  } catch (err) {
    console.error('Error uploading image', err);
  }
};

export default function ImageUpload() {
  const [imageURL, setImageURL] = useState('');

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('username', 'test_user');
    formData.append('image', file);
    await uploadImage(formData);

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
