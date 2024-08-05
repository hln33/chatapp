'use client';

import Image from 'next/image';
import { SERVER_URL } from '@/lib/constants';

type Props = {
  imageURLs: string[];
};

export default function ImagePreview({ imageURLs }: Props) {
  if (imageURLs.length === 0) return null;

  return (
    <>
      <div className="relative indicator w-full">
        <i className="z-10 indicator-item badge badge-secondary font-mono text-white">
          {imageURLs.length}
        </i>

        <div
          className="stack cursor-pointer"
          // @ts-ignore
          onClick={() => document.getElementById('image_preview').showModal()}
        >
          {imageURLs.map((imageURL, index) => (
            <Image
              key={index}
              data-testid="image"
              className="shadow-xl"
              src={`${SERVER_URL}/${imageURL}`}
              alt="preview"
              width={400}
              height={0}
            />
          ))}
        </div>
      </div>

      <dialog id="image_preview" className="modal">
        <div className="modal-box">
          {imageURLs.map((imageURL, index) => (
            <Image
              key={index}
              data-testid="image"
              className="w-auto h-auto p-5"
              src={`${SERVER_URL}/${imageURL}`}
              alt="preview"
              width={0}
              height={0}
              unoptimized // unoptimize for higher quality image
            />
          ))}

          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
