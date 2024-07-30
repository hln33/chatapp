'use client';

import { ChangeEvent, Dispatch, FormEvent, useState } from 'react';
import useChatSocket from '@/hooks/useChatSocket';
import useSession from '@/hooks/useSession';
import { Message } from './types';
import MessageBubble from './messageBubble';
import ImageUpload from './imageUpload';

export default function ChatBox() {
  const [username, setUsername] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [imageURL, setImageURL] = useState<string | null>(null);
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
    }
  };

  const handleTextInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<string>
  ) => {
    setState(e.target.value);
    e.currentTarget.setCustomValidity('');
  };

  const handleImageUpload = (imageURL: string) => {
    setImageURL(imageURL);
  };

  return (
    <div className="space-y-5 w-80">
      <div
        data-testid="chat-window"
        className="flex flex-col bg-white h-72 w-50 py-5 px-2 space-y-3 overflow-y-scroll rounded-md"
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

          <ImageUpload onImageUpload={handleImageUpload} imageURL={imageURL} />
        </div>

        <button
          data-testid="send-button"
          className="btn bg-cyan-400 text-white"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
