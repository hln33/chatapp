import { Message } from '../_types/types';
import ImagePreview from './imagePreview';

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const { fromCurrentUser, username, image_urls } = message;
  const text = message.text
    .split('\n')
    .map((line, index) => <p key={index}>{line}</p>);

  return (
    <div className={`chat chat-${fromCurrentUser ? 'start' : 'end'}`}>
      {!fromCurrentUser && (
        <div className="chat-header text-slate-400">{username}</div>
      )}
      <div
        className={`chat-bubble ${
          fromCurrentUser ? 'chat-bubble-primary' : ''
        }`}
      >
        <span data-testid="message-text" className="h-2">
          {text}
        </span>
        <ImagePreview imageURLs={image_urls} />
      </div>
    </div>
  );
}
