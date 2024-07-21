'use client';

import { FormEvent, useEffect, useState } from 'react';

export default function ChatBox() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [draftMessage, setDraftMessage] = useState('');

  useEffect(() => {
    // get session cookie
    fetch('http://localhost:3001/session', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));

    const ws = new WebSocket('ws://localhost:3001/ws');
    ws.onopen = () => {
      console.log('web socket opened');
    };
    ws.onclose = () => {
      console.log('web socket closed');
    };
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (webSocket === null) return;

    webSocket.onmessage = (event) => {
      console.log(event.data);
      setMessages([...messages, event.data]);
    };
  }, [messages, webSocket]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (webSocket && draftMessage) {
      webSocket.send(draftMessage);
      setMessages([...messages, draftMessage]);
      setDraftMessage('');
    }
  };

  return (
    <>
      <p>chatbox</p>

      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}

      <form onSubmit={sendMessage}>
        <input
          style={{ color: 'black' }}
          type="text"
          value={draftMessage}
          onChange={(e) => setDraftMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
