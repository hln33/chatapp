import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBox from '../chatbox';

vi.mock('@/hooks/useChatSocket', () => ({
  default: () => ({
    messages: [],
    sendMessage: vi.fn(),
  }),
}));
vi.mock('@/hooks/useSession');

describe('<ChatBox />', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correctly', () => {
    render(<ChatBox />);

    expect(screen.getByTestId('chat-window')).toBeDefined();
    expect(screen.getByTestId('username-input')).toBeDefined();
    expect(screen.getByTestId('message-input')).toBeDefined();
  });

  it('clears the message input upon send', async () => {
    const username = 'Harry';
    const message = 'This is my funny message!';
    render(<ChatBox />);
    const user = userEvent.setup();

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
  });
});
