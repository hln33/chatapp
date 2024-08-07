import { Message } from "@/app/chat/_chatbox/types";
import { SOCKET_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

// eslint-disable-next-line no-unused-vars
export default function useChatSocket(): { messages: Message[], sendMessage: (message: Message) => void } {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`${SOCKET_URL}/ws`);
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