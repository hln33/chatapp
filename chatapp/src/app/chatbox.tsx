'use client';

import { useEffect } from 'react';

export default function ChatBox() {
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001/ws');
    console.log(websocket);

    websocket.onopen = () => {
      console.log('web socket opened');
    };
    websocket.onclose = () => {
      console.log('web socket closed');
    };
    return () => {
      websocket.close();
    };
  }, []);

  return <p>chatbox</p>;
}
