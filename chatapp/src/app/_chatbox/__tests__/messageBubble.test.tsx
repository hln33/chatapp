import { afterEach, describe, expect, it } from 'vitest';
import { Message } from '../types';
import MessageBubble from '../messageBubble';
import { cleanup, render, screen } from '@testing-library/react';

const TEST_RECIEVED_MSG: Message = {
  fromCurrentUser: false,
  username: 'Harry',
  text: 'hello world!',
  image_url: 'test/photo/1',
};
const TEST_USER_MSG: Message = {
  fromCurrentUser: true,
  username: 'Tom',
  text: 'heyooo!',
  image_url: 'test/photo/2',
};

describe('<MessageBubble />', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders recieved messagecorrectly', () => {
    render(<MessageBubble message={TEST_RECIEVED_MSG} />);

    expect(screen.getByText(TEST_RECIEVED_MSG.username)).toBeDefined();
    expect(screen.getByText(TEST_RECIEVED_MSG.text)).toBeDefined();
    expect(screen.getByTestId('image')).toBeDefined();
  });

  it('renders user message correctly', () => {
    render(<MessageBubble message={TEST_USER_MSG} />);

    expect(screen.queryByText(TEST_USER_MSG.username)).toBeNull();
    expect(screen.getByText(TEST_USER_MSG.text)).toBeDefined();
    expect(screen.getByTestId('image')).toBeDefined();
  });
});
