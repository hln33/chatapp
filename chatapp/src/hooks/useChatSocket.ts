import { Message } from "@/app/_chatbox/types";
import { useEffect, useState } from "react";

const SOCKET_SERVER_URL = 'http://localhost:3001';

export default function useChatSocket() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`${SOCKET_SERVER_URL}/ws`);
    ws.onopen = () => console.log('web socket opened');
    ws.onclose = () => console.log('web socket closed');
    ws.onmessage = (evt) => {
      const message: Message = JSON.parse(evt.data);
      message.fromCurrentUser = false;

      setMessages((prevMessages) => [
        ...prevMessages,
        message
      ]);
    };
    setWebSocket(ws);

    return () => {
      ws.close();
    }
  }, []);

  const sendMessage = (message: Message) => {
    if (webSocket) {
      webSocket.send(JSON.stringify(message));
    }

    setMessages([...messages, message]);
  }

  return { messages, sendMessage }
}