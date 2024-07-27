import { Message } from './types';

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const alignment = message.fromCurrentUser ? 'justify-start' : 'justify-end';
  const color = message.fromCurrentUser
    ? 'text-white bg-blue-500'
    : 'text-black bg-gray-300';
  const roundedCorners = message.fromCurrentUser
    ? 'rounded-r-2xl rounded-tl-2xl'
    : 'rounded-l-2xl rounded-tr-2xl';

  return (
    <div className={`flex ${alignment}`}>
      <div className={`p-3 max-w-xs ${color} ${roundedCorners}`}>
        {message.text}
      </div>
    </div>
  );
}
