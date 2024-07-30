import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBox from '../chatbox';
import useChatSocket from '@/hooks/useChatSocket';

vi.mock('@/hooks/useChatSocket', () => ({
  default: () => ({
    sendMessage: vi.fn(),
  }),
}));
vi.mock('@/hooks/useSession');

describe('<ChatBox />', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly', () => {
    const { sendMessage } = useChatSocket();

    render(<ChatBox messages={[]} sendMessage={sendMessage} />);

    expect(screen.getByTestId('chat-window')).toBeDefined();
    expect(screen.getByTestId('username-input')).toBeDefined();
    expect(screen.getByTestId('message-input')).toBeDefined();
  });

  it('handles message sending', async () => {
    const username = 'Harry';
    const message = 'This is my funny message!';
    const user = userEvent.setup();
    const { sendMessage } = useChatSocket();
    render(<ChatBox messages={[]} sendMessage={sendMessage} />);

    const usernameInput = screen.getByTestId(
      'username-input'
    ) as HTMLInputElement;
    await user.click(usernameInput);
    await user.keyboard(username);
    expect(usernameInput.value).toEqual(username);

    const messageInput = screen.getByTestId(
      'message-input'
    ) as HTMLInputElement;
    await user.click(messageInput);
    await user.keyboard(message);
    expect(messageInput.value).toEqual(message);

    const sendButton = screen.getByTestId('send-button');
    await user.click(sendButton);

    expect(usernameInput.value).toEqual(username);
    expect(messageInput.value).toEqual('');
    expect(sendMessage).toHaveBeenCalledWith({
      fromCurrentUser: true,
      username,
      text: message,
      image_url: '',
    });
  });
});
