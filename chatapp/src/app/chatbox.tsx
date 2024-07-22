'use client';

import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from 'react';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export default function ChatBox() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [draftMessage, setDraftMessage] = useState('');

  useEffect(() => {
    // get session cookie
    fetch(`${SOCKET_SERVER_URL}/session`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));

    const ws = new WebSocket(`${SOCKET_SERVER_URL}/ws`);
    ws.onopen = () => {
      console.log('web socket opened');
    };
    ws.onclose = () => {
      console.log('web socket closed');
    };
    ws.onmessage = (evt) => {
      console.log(evt.data);
      setMessages((prevMessages) => [...prevMessages, evt.data]);
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
        message: draftMessage,
      };

      webSocket.send(JSON.stringify(messageFormat));
      setMessages([...messages, `You: ${draftMessage}`]);
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

  return (
    <div className="space-y-5">
      <h3 className="text-center">chatbox</h3>

      <div className="flex flex-col bg-white">
        {messages.map((msg, index) => (
          <div className="text-black" key={index}>
            {msg}
          </div>
        ))}
      </div>

      <form className="space-y-3 flex flex-col" onSubmit={sendMessage}>
        <input
          className="text-black"
          required
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => handleInputChange(e, setUsername)}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity('Username must not be blank')
          }
        />
        <input
          className="text-black"
          required
          type="text"
          placeholder="message"
          value={draftMessage}
          onChange={(e) => handleInputChange(e, setDraftMessage)}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity('Message must not be blank')
          }
        />
        <button className="bg-cyan-400" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
