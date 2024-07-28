import Image from 'next/image';
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
      <div className="">
        {!message.fromCurrentUser && (
          <p className="pr-2 text-right text-slate-400">{message.username}</p>
        )}
        <div className={`p-3 max-w-xs ${color} ${roundedCorners}`}>
          <p>{message.image_url}</p>
          <Image
            src={`http://localhost:3001/${message.image_url}`}
            alt="image"
            width={200}
            height={200}
          />
          <p>{message.text}</p>
        </div>
      </div>
    </div>
  );
}
