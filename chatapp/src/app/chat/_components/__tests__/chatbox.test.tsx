import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBox from '../chatbox';
import useChatSocket from '@/hooks/useChatSocket';

vi.mock('@/hooks/useChatSocket', () => ({
  default: () => ({
    sendMessage: vi.fn(),
  }),
}));
vi.mock('@/hooks/useSession');
vi.mock('@/context/userContext', () => ({
  useUser: () => vi.fn(),
}));

describe('<ChatBox />', () => {
  it('renders correctly', () => {
    render(<ChatBox messages={[]} sendMessage={vi.fn()} />);

    expect(screen.getByTestId('chat-window')).toBeDefined();
    expect(screen.getByTestId('message-input')).toBeDefined();
  });

  it('handles message sending', async () => {
    const user = userEvent.setup();
    const { sendMessage } = useChatSocket();
    render(<ChatBox messages={[]} sendMessage={sendMessage} />);

    const message = 'This is my funny message!';
    const messageInput = screen.getByTestId(
      'message-input'
    ) as HTMLInputElement;
    await user.click(messageInput);
    await user.keyboard(message);
    expect(messageInput.value).toEqual(message);

    const sendButton = screen.getByTestId('send-button');
    await user.click(sendButton);

    expect(messageInput.value).toEqual('');
    expect(sendMessage).toHaveBeenCalled();
  });
});
