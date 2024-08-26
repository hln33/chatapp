'use client';

import useChatSocket from '@/hooks/useChatSocket';
import ChatBox from './chatbox';

export default function ChatWindow() {
  const { messages, sendMessage } = useChatSocket();

  return <ChatBox messages={messages} sendMessage={sendMessage} />;
}
