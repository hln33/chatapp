'use client';

import { ChangeEvent, Dispatch, FormEvent, useState } from 'react';
import { Message } from '../_types/types';
import MessageBubble from './messageBubble';
import ImageUpload from './imageUpload';
import ImagePreview from './imagePreview';
import { useUser } from '@/context/userContext';

type Props = {
  messages: Message[];
  // eslint-disable-next-line no-unused-vars
  sendMessage: (message: Message) => void;
};

export default function ChatBox({ messages, sendMessage }: Props) {
  const { user } = useUser();
  const [username] = useState(user?.username ?? 'Unknown User');
  const [draftMessage, setDraftMessage] = useState('');
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (draftMessage && username) {
      const message: Message = {
        fromCurrentUser: true,
        username,
        text: draftMessage,
        image_urls: imageURLs,
      };
      sendMessage(message);

      setDraftMessage('');
      setImageURLs([]);
    }
  };

  const handleTextInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<string>
  ) => {
    setState(e.target.value);
    e.currentTarget.setCustomValidity('');
  };

  const handleImageUpload = (imageURLs: string[]) => {
    setImageURLs(imageURLs);
  };

  return (
    <div className="space-y-5 w-96">
      <div
        data-testid="chat-window"
        className="bg-white h-72 w-50 py-5 px-2 overflow-y-scroll rounded-md"
      >
        {messages.map((msg, index) => (
          <MessageBubble message={msg} key={index} />
        ))}
      </div>

      <form className="space-y-3 flex flex-col" onSubmit={handleSubmit}>
        <div className="join">
          <textarea
            required
            data-testid="message-input"
            className="textarea textarea-bordered h-10 flex-1 join-item"
            placeholder="message"
            value={draftMessage}
            onChange={(e) => handleTextInputChange(e, setDraftMessage)}
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity('Message must not be blank')
            }
          />

          <div className="flex-none join-item">
            <ImageUpload
              onImagesUpload={handleImageUpload}
              imageURLs={imageURLs}
            />
          </div>
        </div>

        <button
          data-testid="send-button"
          className="btn bg-cyan-400 text-white"
          type="submit"
        >
          Send
        </button>
      </form>

      <ImagePreview imageURLs={imageURLs} />
    </div>
  );
}
