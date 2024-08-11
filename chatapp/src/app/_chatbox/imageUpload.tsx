import { ChangeEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/api';
import { SERVER_URL } from '@/lib/constants';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onImagesUpload: (imageURLs: string[]) => void;
  imageURLs: string[];
};

export default function ImageUpload({ onImagesUpload, imageURLs }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imageURLs]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const formData = new FormData();
    [...e.target.files].forEach((file) => {
      formData.append('images', file);
    });

    const serverImageURLs = await uploadImage(formData);
    if (serverImageURLs) {
      onImagesUpload(serverImageURLs);
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
          multiple={true}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </label>

      <div className="relative">
        {imageURLs.length !== 0 && (
          <i className="absolute z-10 top-3 right-0 rounded-full w-8 h-8 flex items-center justify-center font-sans bg-black">
            {imageURLs.length}
          </i>
        )}
        <div className="stack">
          {imageURLs.map((imageURL, index) => (
            <Image
              key={index}
              data-testid="image"
              className="w-auto h-auto shadow-xl"
              src={`${SERVER_URL}/${imageURL}`}
              alt="preview"
              width={0}
              height={0}
              unoptimized // unoptimize for higher quality image
            />
          ))}
        </div>
      </div>
    </>
  );
}
