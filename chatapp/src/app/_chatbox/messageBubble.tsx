import { Message } from './types';

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const alignment = message.fromCurrentUser ? 'justify-start' : 'justify-end';
  const color = message.fromCurrentUser
    ? 'text-white bg-blue-500'
    : 'text-black bg-gray-300';

  return (
    <div className={`flex ${alignment}`}>
      <div className={`p-3 rounded-lg max-w-xs ${color}`}>{message.text}</div>
    </div>
  );
}
