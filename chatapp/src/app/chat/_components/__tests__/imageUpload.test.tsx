import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ImageUpload from '../imageUpload';
import userEvent from '@testing-library/user-event';

const TEST_IMAGE_URL = 'testURL/photo/1';

describe('<ImageUpload />', () => {
  it('renders correctly', () => {
    render(
      <ImageUpload imageURLs={[TEST_IMAGE_URL]} onImagesUpload={vi.fn()} />
    );

    expect(screen.getByTestId('file-input-label')).toBeDefined();
    expect(screen.getByTestId('file-input')).toBeDefined();
  });

  it('shows no images if there is no url provided', () => {
    render(<ImageUpload imageURLs={[]} onImagesUpload={vi.fn()} />);

    expect(screen.getByTestId('file-input-label')).toBeDefined();
    expect(screen.getByTestId('file-input')).toBeDefined();
    expect(screen.queryByTestId('images')).toBeNull();
  });

  it('calls onImageUpload when a file is inputted', async () => {
    vi.mock('@/lib/api', () => ({
      uploadImage: vi.fn(() => TEST_IMAGE_URL),
    }));
    const user = userEvent.setup();
    const mockOnImageUpload = vi.fn();
    render(<ImageUpload imageURLs={[]} onImagesUpload={mockOnImageUpload} />);

    const imageFile = new File(['hello'], 'hello.jpg', { type: 'image/jpg' });
    const imageInput = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(imageInput, imageFile);

    expect(imageInput.type).toEqual('file');
    expect(imageInput.files).toHaveLength(1);
    expect(imageInput.files?.item(0)).toBe(imageFile);
    expect(mockOnImageUpload).toHaveBeenCalled();
  });
});
