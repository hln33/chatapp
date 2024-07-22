'use client';

import { FormEvent, useEffect, useState } from 'react';

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
          type="text"
          value={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="text-black"
          type="text"
          value={draftMessage}
          placeholder="message"
          onChange={(e) => setDraftMessage(e.target.value)}
        />
        <button className="bg-cyan-400" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
