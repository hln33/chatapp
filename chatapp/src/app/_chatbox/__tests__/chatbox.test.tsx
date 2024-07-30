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
    const user = userEvent.setup();
    render(<ChatBox />);

    const usernameInput = screen.getByTestId(
      'username-input'
    ) as HTMLInputElement;
    await user.click(usernameInput);
    await user.keyboard('Harry');
    expect(usernameInput.value).toEqual('Harry');

    const messageInput = screen.getByTestId(
      'message-input'
    ) as HTMLInputElement;
    await user.click(messageInput);
    await user.keyboard('This is my funny message!');
    expect(messageInput.value).toEqual('This is my funny message!');

    const sendButton = screen.getByTestId('send-button');
    await user.click(sendButton);
    expect(messageInput.value).toEqual('');
  });
});
