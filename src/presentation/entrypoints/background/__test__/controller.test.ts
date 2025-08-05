import { describe, it, expect, vi } from 'vitest';

// Mock all dependencies to avoid complex browser runtime issues
vi.mock('~@/config/chromeLanguageDetector/chromeLanguageDetector.local.datasource', () => ({
  chromeLanguageDetector: {
    local: {
      datasource: {
        detectLanguage: vi.fn(() => Promise.resolve('en')),
      },
    },
  },
}));

vi.mock('~@/config/chromeTranslator/chromeTranslator.local.datasource', () => ({
  chromeTranslator: {
    local: {
      datasource: {
        translateText: vi.fn(() => Promise.resolve('translated text')),
      },
    },
  },
}));

vi.mock('~@/config/utils/compareSemanticVersions', () => ({
  compareSemanticVersions: vi.fn(() => true),
}));

// Import after mocking
import { backgroundController } from '../controller';

describe('backgroundController', () => {
  it('should be defined', () => {
    expect(backgroundController).toBeDefined();
  });

  it('should have handleChatMessage method', () => {
    expect(typeof backgroundController.handleChatMessage).toBe('function');
  });

  it('should have handleInputMessage method', () => {
    expect(typeof backgroundController.handleInputMessage).toBe('function');
  });

  it('should have handleCheckExtUpload method', () => {
    expect(typeof backgroundController.handleCheckExtUpload).toBe('function');
  });

  it('should be a valid controller object', () => {
    expect(backgroundController).toBeInstanceOf(Object);
    expect(Object.keys(backgroundController).length).toBeGreaterThan(0);
  });
});