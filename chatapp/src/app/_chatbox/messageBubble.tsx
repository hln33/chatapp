import { Message } from './types';
import ImagePreview from './imagePreview';

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const alignment = message.fromCurrentUser ? 'justify-start' : 'justify-end';
  const textAlignment = message.fromCurrentUser ? 'text-left' : 'text-right';
  const color = message.fromCurrentUser
    ? 'text-white bg-blue-500'
    : 'text-black bg-gray-300';
  const roundedCorners = message.fromCurrentUser
    ? 'rounded-r-2xl rounded-tl-2xl'
    : 'rounded-l-2xl rounded-tr-2xl';

  const userName = !message.fromCurrentUser && (
    <p className={`pr-2 ${textAlignment} text-slate-400`}>{message.username}</p>
  );
  const text = message.text.split('\n').map((line, index) => (
    <p className={textAlignment} key={index}>
      {line}
    </p>
  ));

  return (
    <div className={`flex ${alignment}`}>
      <div>
        {userName}
        <div className={`p-3 max-w-xs space-y-3 ${color} ${roundedCorners}`}>
          <span data-testid="message-text">{text}</span>
          <ImagePreview imageURLs={message.image_urls} />
        </div>
      </div>
    </div>
  );
}
