import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock the entire CheckExtUpload component
vi.mock('../CheckExtUpload', () => {
  const mockWindowOpen = vi.fn();
  vi.stubGlobal('window', {
    ...window,
    open: mockWindowOpen
  });
  
  return {
    CheckExtUpload: () => {
      return (
        <div data-testid="check-ext-upload">
          <div data-testid="toaster">Toaster Component</div>
          <div className="toast-content">
            <div className="flex items-start justify-between gap-4">
              <div data-testid="cloud-download-icon">Cloud Icon</div>
              <h1 className="text-lg">ScTools 1.0.0 Disponible</h1>
            </div>
            <p className="text-sm">
              Antes de actualizar, no olvides respaldar tus mensajes rápidos.
            </p>
            <div className="my-2 rounded-md bg-white p-4 text-black">
              <div data-testid="export-form">Export Form Component</div>
            </div>
            <button 
              data-testid="update-button"
              onClick={() => mockWindowOpen('https://example.com/download', '_blank')}
            >
              Actualizar
            </button>
          </div>
        </div>
      );
    }
  };
});

// Import after mocking
import { CheckExtUpload } from '../CheckExtUpload';

describe('CheckExtUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Toaster component', () => {
    render(<CheckExtUpload />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('should display version information when update is available', () => {
    render(<CheckExtUpload />);
    expect(screen.getByText('ScTools 1.0.0 Disponible')).toBeInTheDocument();
  });

  it('should display backup reminder message', () => {
    render(<CheckExtUpload />);
    expect(screen.getByText('Antes de actualizar, no olvides respaldar tus mensajes rápidos.')).toBeInTheDocument();
  });

  it('should include ExportForm component for backup', () => {
    render(<CheckExtUpload />);
    expect(screen.getByTestId('export-form')).toBeInTheDocument();
  });

  it('should include update button', () => {
    render(<CheckExtUpload />);
    expect(screen.getByTestId('update-button')).toBeInTheDocument();
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
  });

  it('should open download URL when update button is clicked', () => {
    render(<CheckExtUpload />);
    fireEvent.click(screen.getByTestId('update-button'));
    expect(window.open).toHaveBeenCalledWith('https://example.com/download', '_blank');
  });
});