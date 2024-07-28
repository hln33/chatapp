'use client';

import { ChangeEvent, Dispatch, FormEvent, useState } from 'react';
import { Message } from './types';
import MessageBubble from './messageBubble';
import ImageUpload from './imageUpload';
import useSession from '@/hooks/useSession';
import useChatSocket from '@/hooks/useChatSocket';

export default function ChatBox() {
  const [username, setUsername] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [imageURL, setImageURL] = useState<string | null>();
  const [clearImagePreview, setClearImagePreview] = useState(false);
  const { messages, sendMessage } = useChatSocket();
  useSession();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (draftMessage && username) {
      const message: Message = {
        fromCurrentUser: true,
        username,
        text: draftMessage,
        image_url: imageURL ?? '',
      };
      sendMessage(message);

      setDraftMessage('');
      setImageURL(null);
      setClearImagePreview(true);
    }
  };

  const handleTextInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setState: Dispatch<string>
  ) => {
    setState(e.target.value);
    e.currentTarget.setCustomValidity('');
  };

  const handleImageUpload = (imageURL: string) => {
    setImageURL(imageURL);
    setClearImagePreview(false);
  };

  return (
    <div className="space-y-5 w-80">
      <div className="flex flex-col bg-white py-5 px-2 space-y-3 rounded-md">
        {messages.map((msg, index) => (
          <MessageBubble message={msg} key={index} />
        ))}
      </div>

      <form className="space-y-3 flex flex-col" onSubmit={handleSubmit}>
        <input
          required
          className="text-black px-3"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => handleTextInputChange(e, setUsername)}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity('Username must not be blank')
          }
        />
        <input
          required
          className="text-black px-3"
          type="text"
          placeholder="message"
          value={draftMessage}
          onChange={(e) => handleTextInputChange(e, setDraftMessage)}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity('Message must not be blank')
          }
        />

        <ImageUpload
          onImageUpload={handleImageUpload}
          clearImagePreview={clearImagePreview}
        />

        <button className="bg-cyan-400" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
