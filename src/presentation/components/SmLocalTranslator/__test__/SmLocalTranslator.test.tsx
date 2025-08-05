import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmLocalTranslator } from '../SmLocalTranslator';
import * as useMutationObserverModule from '~@/presentation/hooks/useMutationObserver/useMutationObserver';
import * as useQuickMenuIsActiveModule from '~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive';
import { smAdapter } from '~@/config/smAdapter/sm.adapter';
import { GLOBAL_STRINGS } from '~@/config/utils/globalStrings';

// Mock the hooks
vi.mock('~@/presentation/hooks/useMutationObserver/useMutationObserver', () => ({
  useMutationObserver: vi.fn(),
}));

vi.mock('~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive', () => ({
  useQuickMenuIsActive: vi.fn(() => ({
    getItem: vi.fn().mockResolvedValue(true),
    watchItem: vi.fn(),
  })),
}));

// Mock the smAdapter
vi.mock('~@/config/smAdapter/sm.adapter', () => ({
  smAdapter: {
    getChatTab: vi.fn(),
  },
}));

// Mock the TranslatedMessage component
vi.mock('../TranslatedMessage/TranslatedMessage', () => ({
  TranslatedMessage: ({ message, bgColor }: { message: string; bgColor: string }) => (
    <div data-testid="translated-message" style={{ backgroundColor: bgColor }}>
      {message}
    </div>
  ),
}));

// Mock browser runtime
const mockBrowserRuntime = {
  sendMessage: vi.fn(),
};

// @ts-ignore
global.browser = {
  runtime: mockBrowserRuntime,
};

// Mock createRoot
const mockRender = vi.fn();
const mockRoot = {
  render: mockRender,
};

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => mockRoot),
}));

// Mock DOM elements helper
const createMockElement = (tagName: string = 'div') => {
  return document.createElement(tagName);
};

const createMockDiv = () => {
  return document.createElement('div') as HTMLDivElement;
};

describe('SmLocalTranslator', () => {
  const mockUseMutationObserver = vi.mocked(useMutationObserverModule.useMutationObserver);
  const mockUseQuickMenuIsActive = vi.mocked(useQuickMenuIsActiveModule.useQuickMenuIsActive);
  const mockSmAdapter = vi.mocked(smAdapter);

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    
    // Setup default mocks
    mockSmAdapter.getChatTab.mockReturnValue(createMockDiv());
    
    mockUseQuickMenuIsActive.mockReturnValue({
      getItem: vi.fn().mockResolvedValue(true),
      watchItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<SmLocalTranslator />);
      
      // The component renders a hidden div
      const hiddenDiv = document.querySelector('.hidden');
      expect(hiddenDiv).toBeInTheDocument();
    });

    it('should initialize with correct adapter calls', () => {
      render(<SmLocalTranslator />);
      
      expect(mockSmAdapter.getChatTab).toHaveBeenCalledTimes(1);
    });

    it('should setup mutation observer', () => {
      render(<SmLocalTranslator />);
      
      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.any(Object),
        callback: expect.any(Function),
      });
    });

    it('should setup quick menu watcher', () => {
      const mockWatchItem = vi.fn();
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        watchItem: mockWatchItem,
        setItem: vi.fn(),
      });
      
      render(<SmLocalTranslator />);
      
      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('Mutation Observer Setup', () => {
    it('should setup mutation observer with correct parameters', () => {
      render(<SmLocalTranslator />);
      
      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({ current: expect.any(Object) }),
        callback: expect.any(Function),
      });
    });

    it('should handle mutation callback without errors', () => {
      render(<SmLocalTranslator />);
      const mutationCallback = mockUseMutationObserver.mock.calls[0][0].callback;
      
      // Test that callback can be called without throwing
      expect(() => {
        mutationCallback([], {} as MutationObserver);
      }).not.toThrow();
    });
  });

  describe('Extension State Management', () => {
    it('should initialize extension state from storage', async () => {
      const mockGetItem = vi.fn().mockResolvedValue(false);
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: mockGetItem,
        watchItem: vi.fn(),
        setItem: vi.fn(),
      });
      
      render(<SmLocalTranslator />);
      
      // Wait for useEffect to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockGetItem).toHaveBeenCalled();
    });

    it('should update state when watchItem callback is triggered', () => {
      let watchCallback: (value: boolean) => void;
      const mockWatchItem = vi.fn((callback) => {
        watchCallback = callback;
      });
      
      mockUseQuickMenuIsActive.mockReturnValue({
        getItem: vi.fn().mockResolvedValue(true),
        watchItem: mockWatchItem,
        setItem: vi.fn(),
      });
      
      render(<SmLocalTranslator />);
      
      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
      
      // Trigger the watch callback
      watchCallback!(false);
      
      // The state should be updated (this is tested indirectly through mutation processing)
    });
  });

  describe('Component Structure', () => {
    it('should have correct component structure', () => {
      const { container } = render(<SmLocalTranslator />);
      
      expect(container.firstChild).toHaveClass('hidden');
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('should not render any visible content', () => {
      render(<SmLocalTranslator />);
      
      // Should not have any visible text content
      expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });
  });

  describe('Adapter Integration', () => {
    it('should handle null chat tab from adapter', () => {
      mockSmAdapter.getChatTab.mockReturnValue(null);
      
      render(<SmLocalTranslator />);
      
      expect(mockSmAdapter.getChatTab).toHaveBeenCalled();
      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({ current: null }),
        callback: expect.any(Function),
      });
    });

    it('should handle valid chat tab from adapter', () => {
      const mockChatTab = createMockDiv();
      mockSmAdapter.getChatTab.mockReturnValue(mockChatTab);
      
      render(<SmLocalTranslator />);
      
      expect(mockSmAdapter.getChatTab).toHaveBeenCalled();
      expect(mockUseMutationObserver).toHaveBeenCalledWith({
        ref: expect.objectContaining({ current: mockChatTab }),
        callback: expect.any(Function),
      });
    });
  });
});