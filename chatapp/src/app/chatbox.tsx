'use client';

import { FormEvent, useEffect, useState } from 'react';

export default function ChatBox() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [draftMessage, setDraftMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001/ws');
    ws.onopen = () => {
      console.log('web socket opened');
      ws.send('hello server!');
    };
    ws.onclose = () => {
      console.log('web socket closed');
    };
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (webSocket && draftMessage) {
      webSocket.send(draftMessage);
      setDraftMessage('');
    }
  };

  return (
    <>
      <p>chatbox</p>

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
