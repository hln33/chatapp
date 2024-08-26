import { describe, expect, it } from 'vitest';
import { Message } from '../../_types/types';
import MessageBubble from '../messageBubble';
import { render, screen } from '@testing-library/react';

const TEST_RECIEVED_MSG: Message = {
  fromCurrentUser: false,
  username: 'Harry',
  text: 'hello world!',
  image_urls: ['test/photo/1'],
};
const TEST_USER_MSG: Message = {
  fromCurrentUser: true,
  username: 'Tom',
  text: 'heyooo!',
  image_urls: ['test/photo/2'],
};

describe.only('<MessageBubble />', () => {
  it('renders recieved message correctly', () => {
    console.error(process.env);
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
