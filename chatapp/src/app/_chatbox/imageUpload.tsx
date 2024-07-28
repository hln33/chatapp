import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/api';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onImageUpload: (imageURL: string) => void;
  clearImagePreview: boolean;
};

export default function ImageUpload({
  onImageUpload,
  clearImagePreview,
}: Props) {
  const [previewImageURL, setPreviewImageURL] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!clearImagePreview) return;

    setPreviewImageURL('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearImagePreview]);

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
    setPreviewImageURL(imageURL);
  };

  return (
    <>
      {previewImageURL && (
        <Image
          className="w-auto h-auto"
          src={previewImageURL}
          width={0}
          height={0}
          alt="preview"
        />
      )}
      <input type="file" ref={fileInputRef} onChange={handleImageChange} />
    </>
  );
}
