'use client';

import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from 'react';
import { Message } from './types';
import MessageBubble from './messageBubble';
import ImageUpload from './imageUpload';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export default function ChatBox() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [imageURL, setImageURL] = useState<string | null>();
  const [Messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // get session cookie
    fetch(`${SOCKET_SERVER_URL}/session`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`${SOCKET_SERVER_URL}/ws`);
    ws.onopen = () => console.log('web socket opened');
    ws.onclose = () => console.log('web socket closed');
    ws.onmessage = (evt) => {
      const message: Message = JSON.parse(evt.data);
      console.log(message);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          fromCurrentUser: false,
          username: message.username,
          text: message.text,
          image_url: message.image_url,
        },
      ]);
    };
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (webSocket && draftMessage && username) {
      const messageFormat = {
        username,
        text: draftMessage,
        image_url: imageURL,
      };
      webSocket.send(JSON.stringify(messageFormat));

      setMessages([
        ...Messages,
        {
          fromCurrentUser: true,
          username,
          text: draftMessage,
          image_url: imageURL ?? '',
        },
      ]);
      setDraftMessage('');
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
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
      <div className="flex flex-col bg-white py-5 px-2 space-y-3 rounded-md">
        {Messages.map((msg, index) => (
          <MessageBubble message={msg} key={index} />
        ))}
      </div>

      <form className="space-y-3 flex flex-col" onSubmit={sendMessage}>
        <input
          required
          className="text-black px-3"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => handleInputChange(e, setUsername)}
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
          onChange={(e) => handleInputChange(e, setDraftMessage)}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity('Message must not be blank')
          }
        />

        <ImageUpload onImageUpload={handleImageUpload} />

        <button className="bg-cyan-400" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
