import { render, screen } from '@testing-library/react';
import ImagePreview from '../imagePreview';
import { describe, expect, it } from 'vitest';

const TEST_IMAGE_URLS = [
  'testURL/photo/1',
  'testURL/photo/2',
  'testURL/photo/3',
];

describe('<ImagePreview />', () => {
  it('renders no images', () => {
    render(<ImagePreview imageURLs={[]} />);
    expect(screen.queryByTestId('image')).toBeNull();
  });

  it('renders a single image', () => {
    render(<ImagePreview imageURLs={[TEST_IMAGE_URLS[0]]} />);
    expect(screen.getAllByTestId('image')).toHaveLength(1);
  });

  it('renders multiple images', () => {
    render(<ImagePreview imageURLs={TEST_IMAGE_URLS} />);
    expect(screen.getAllByTestId('image')).toHaveLength(3);
  });
});
