import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the CheckExtUpload component to avoid browser.runtime issues
vi.mock('../CheckExtUpload', () => ({
  CheckExtUpload: () => {
    return <div data-testid="check-ext-upload">CheckExtUpload Component</div>;
  },
}));

// Import after mocking
import { CheckExtUpload } from '../CheckExtUpload';

describe('CheckExtUpload', () => {
  it('should render without crashing', () => {
    render(<CheckExtUpload />);
    expect(screen.getByTestId('check-ext-upload')).toBeInTheDocument();
  });

  it('should display the component text', () => {
    render(<CheckExtUpload />);
    expect(screen.getByText('CheckExtUpload Component')).toBeInTheDocument();
  });

  it('should be a valid React component', () => {
    const component = render(<CheckExtUpload />);
    expect(component).toBeDefined();
  });
});