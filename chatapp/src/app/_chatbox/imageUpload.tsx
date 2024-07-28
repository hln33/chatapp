import { ChangeEvent, useState } from 'react';

export default function ImageUpload() {
  const [imageURL, setImageURL] = useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setImageURL(imageURL);
  };

  return (
    <>
      {imageURL && <img src={imageURL} />}
      <input type="file" onChange={handleImageChange} />
    </>
  );
}
