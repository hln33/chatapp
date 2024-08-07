'use client';

import { ChangeEvent, Dispatch, FormEvent, useState } from 'react';
// import useSession from '@/hooks/useSession';
import { Message } from './types';
import MessageBubble from './messageBubble';
import ImageUpload from './imageUpload';
import ImagePreview from './imagePreview';

type Props = {
  messages: Message[];
  // eslint-disable-next-line no-unused-vars
  sendMessage: (message: Message) => void;
};

export default function ChatBox({ messages, sendMessage }: Props) {
  const [username, setUsername] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  // useSession();

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
        className="bg-white h-96 w-50 py-5 px-2 overflow-y-scroll rounded-md"
      >
        {messages.map((msg, index) => (
          <MessageBubble message={msg} key={index} />
        ))}
      </div>

      <form className="space-y-3 flex flex-col" onSubmit={handleSubmit}>
        <input
          required
          data-testid="username-input"
          className="input input-bordered"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => handleTextInputChange(e, setUsername)}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity('Username must not be blank')
          }
        />

        <div className="flex flex-col relative">
          <textarea
            required
            data-testid="message-input"
            className="textarea textarea-bordered"
            placeholder="message"
            value={draftMessage}
            onChange={(e) => handleTextInputChange(e, setDraftMessage)}
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity('Message must not be blank')
            }
          />

          <ImageUpload
            onImagesUpload={handleImageUpload}
            imageURLs={imageURLs}
          />
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
