import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatBox from '../chatbox';

describe('<ChatBox />', () => {
  it('renders correctly', () => {
    render(<ChatBox />);

    expect(screen.getByTestId('chat-window')).toBeDefined();
    expect(screen.getByTestId('username-input')).toBeDefined();
    expect(screen.getByTestId('message-input')).toBeDefined();
  });
});
