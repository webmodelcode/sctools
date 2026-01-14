import { describe, it, expect, vi, beforeEach } from "vitest";
import { selectTextInContentEditable } from "../selectTextInContentEditable";

// Mock DOM APIs
const mockRange = {
  selectNodeContents: vi.fn(),
};

const mockSelection = {
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
};

Object.defineProperty(document, 'createRange', {
  value: vi.fn(() => mockRange),
  writable: true,
});

Object.defineProperty(window, 'getSelection', {
  value: vi.fn(() => mockSelection),
  writable: true,
});

describe('selectTextInContentEditable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a range and select node contents', () => {
    const mockElement = document.createElement('div');
    mockElement.contentEditable = 'true';
    mockElement.textContent = 'Test content';

    selectTextInContentEditable(mockElement);

    expect(document.createRange).toHaveBeenCalled();
    expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockElement);
  });

  it('should clear existing selection and add new range', () => {
    const mockElement = document.createElement('div');
    mockElement.contentEditable = 'true';

    selectTextInContentEditable(mockElement);

    expect(window.getSelection).toHaveBeenCalled();
    expect(mockSelection.removeAllRanges).toHaveBeenCalled();
    expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange);
  });

  it('should handle null selection gracefully', () => {
    const mockElement = document.createElement('div');
    
    // Mock getSelection to return null
    vi.mocked(window.getSelection).mockReturnValue(null);

    expect(() => {
      selectTextInContentEditable(mockElement);
    }).not.toThrow();

    expect(document.createRange).toHaveBeenCalled();
    expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockElement);
  });

  it('should work with different HTML elements', () => {
    const elements = [
      document.createElement('div'),
      document.createElement('span'),
      document.createElement('p'),
      document.createElement('textarea'),
    ];

    elements.forEach((element) => {
      selectTextInContentEditable(element);
      expect(mockRange.selectNodeContents).toHaveBeenCalledWith(element);
    });

    expect(document.createRange).toHaveBeenCalledTimes(elements.length);
  });

  it('should handle elements with complex content', () => {
    const mockElement = document.createElement('div');
    mockElement.innerHTML = '<span>Hello</span> <strong>World</strong>';

    selectTextInContentEditable(mockElement);

    expect(document.createRange).toHaveBeenCalled();
    expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockElement);
    expect(mockSelection.removeAllRanges).toHaveBeenCalled();
    expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange);
  });

  it('should handle empty elements', () => {
    const mockElement = document.createElement('div');
    // Element with no content

    selectTextInContentEditable(mockElement);

    expect(document.createRange).toHaveBeenCalled();
    expect(mockRange.selectNodeContents).toHaveBeenCalledWith(mockElement);
    expect(mockSelection.removeAllRanges).toHaveBeenCalled();
    expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange);
  });

  it('should call methods in correct order', () => {
    const mockElement = document.createElement('div');
    const callOrder: string[] = [];

    vi.mocked(document.createRange).mockImplementation(() => {
      callOrder.push('createRange');
      return {
        selectNodeContents: vi.fn(() => {
          callOrder.push('selectNodeContents');
        }),
      } as any;
    });

    vi.mocked(window.getSelection).mockImplementation(() => {
      callOrder.push('getSelection');
      return {
        removeAllRanges: vi.fn(() => {
          callOrder.push('removeAllRanges');
        }),
        addRange: vi.fn(() => {
          callOrder.push('addRange');
        }),
      } as any;
    });

    selectTextInContentEditable(mockElement);

    expect(callOrder).toEqual([
      'createRange',
      'selectNodeContents',
      'getSelection',
      'removeAllRanges',
      'addRange',
    ]);
  });
});