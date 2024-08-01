import { ChangeEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/api';
import { SERVER_URL } from '@/lib/constants';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onImageUpload: (imageURL: string) => void;
  imageURL: string | null;
};

export default function ImageUpload({ onImageUpload, imageURL }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imageURL]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const serverImageURL = await uploadImage(formData);
    if (serverImageURL) {
      onImageUpload(serverImageURL);
    }
  };

  return (
    <>
      <label
        data-testid="file-input-label"
        className="cursor-pointer absolute z-10 right-1"
        htmlFor="file-input"
      >
        📎
        <input
          data-testid="file-input"
          id="file-input"
          className="hidden"
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </label>

      {imageURL && (
        <div data-testid="images" className="bg-white border-t-2 p-5">
          <Image
            className="w-auto h-auto"
            src={`${SERVER_URL}/${imageURL}`}
            alt="preview"
            width={0}
            height={0}
            unoptimized // unoptimize for higher quality image
          />
        </div>
      )}
    </>
  );
}
