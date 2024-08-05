import { ChangeEvent, useEffect, useRef } from 'react';
import { uploadImage } from '@/lib/api';

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
    </>
  );
}
