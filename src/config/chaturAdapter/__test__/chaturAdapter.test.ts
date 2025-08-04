import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chaturAdapter } from '../chaturAdapter';

// Mock DOM elements
const createMockElement = (tagName: string = 'div') => {
  const element = document.createElement(tagName);
  return element;
};

describe('chaturAdapter', () => {
  beforeEach(() => {
    // Clear DOM before each test
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('getPublicChatTab', () => {
    it('should return the first public chat tab element when it exists', () => {
      // Setup DOM structure
      const chatTabContents = createMockElement();
      chatTabContents.className = 'ChatTabContents TheatermodeChatDivChat';
      
      const msgListWrapper = createMockElement();
      msgListWrapper.className = 'msg-list-wrapper-split';
      
      const msgList = createMockElement();
      msgList.className = 'msg-list-fvm message-list';
      
      msgListWrapper.appendChild(msgList);
      chatTabContents.appendChild(msgListWrapper);
      document.body.appendChild(chatTabContents);
      
      const result = chaturAdapter.getPublicChatTab();
      expect(result).toBe(msgList);
    });

    it('should return undefined when public chat tab does not exist', () => {
      const result = chaturAdapter.getPublicChatTab();
      expect(result).toBeUndefined();
    });

    it('should return the first element when multiple public chat tabs exist', () => {
      // Setup multiple elements
      for (let i = 0; i < 2; i++) {
        const chatTabContents = createMockElement();
        chatTabContents.className = 'ChatTabContents TheatermodeChatDivChat';
        
        const msgListWrapper = createMockElement();
        msgListWrapper.className = 'msg-list-wrapper-split';
        
        const msgList = createMockElement();
        msgList.className = 'msg-list-fvm message-list';
        msgList.setAttribute('data-test-id', `element-${i}`);
        
        msgListWrapper.appendChild(msgList);
        chatTabContents.appendChild(msgListWrapper);
        document.body.appendChild(chatTabContents);
      }
      
      const result = chaturAdapter.getPublicChatTab();
      expect(result?.getAttribute('data-test-id')).toBe('element-0');
    });
  });

  describe('getChaturPvtChatTab', () => {
    it('should return the private chat tab element when it exists', () => {
      // Setup DOM structure
      const chatTabContents = createMockElement();
      chatTabContents.className = 'ChatTabContents TheatermodeChatDivPm';
      
      const msgListWrapper = createMockElement();
      msgListWrapper.className = 'msg-list-wrapper-split';
      
      const msgList = createMockElement();
      msgList.className = 'msg-list-fvm message-list';
      
      msgListWrapper.appendChild(msgList);
      chatTabContents.appendChild(msgListWrapper);
      document.body.appendChild(chatTabContents);
      
      const result = chaturAdapter.getChaturPvtChatTab();
      expect(result).toBe(msgList);
    });

    it('should return undefined when private chat tab does not exist', () => {
      const result = chaturAdapter.getChaturPvtChatTab();
      expect(result).toBeUndefined();
    });
  });

  describe('getTabsContainer', () => {
    it('should return the tabs container element when it exists', () => {
      const tabsContainer = createMockElement();
      tabsContainer.id = 'ChatTabContainer';
      tabsContainer.className = 'BaseTabsContainer';
      document.body.appendChild(tabsContainer);
      
      const result = chaturAdapter.getTabsContainer();
      expect(result).toBe(tabsContainer);
    });

    it('should return null when tabs container does not exist', () => {
      const result = chaturAdapter.getTabsContainer();
      expect(result).toBeNull();
    });

    it('should return element with correct id and class', () => {
      const tabsContainer = createMockElement();
      tabsContainer.id = 'ChatTabContainer';
      tabsContainer.className = 'BaseTabsContainer';
      document.body.appendChild(tabsContainer);
      
      const result = chaturAdapter.getTabsContainer();
      expect(result?.id).toBe('ChatTabContainer');
      expect(result?.className).toBe('BaseTabsContainer');
    });
  });

  describe('isPublicChatTabReady', () => {
    it('should return true when both public chat tab and tabs container exist', () => {
      // Setup public chat tab
      const chatTabContents = createMockElement();
      chatTabContents.className = 'ChatTabContents TheatermodeChatDivChat';
      
      const msgListWrapper = createMockElement();
      msgListWrapper.className = 'msg-list-wrapper-split';
      
      const msgList = createMockElement();
      msgList.className = 'msg-list-fvm message-list';
      
      msgListWrapper.appendChild(msgList);
      chatTabContents.appendChild(msgListWrapper);
      document.body.appendChild(chatTabContents);
      
      // Setup tabs container
      const tabsContainer = createMockElement();
      tabsContainer.id = 'ChatTabContainer';
      tabsContainer.className = 'BaseTabsContainer';
      document.body.appendChild(tabsContainer);
      
      const result = chaturAdapter.isPublicChatTabReady();
      expect(result).toBe(true);
    });

    it('should return false when public chat tab does not exist', () => {
      // Setup only tabs container
      const tabsContainer = createMockElement();
      tabsContainer.id = 'ChatTabContainer';
      tabsContainer.className = 'BaseTabsContainer';
      document.body.appendChild(tabsContainer);
      
      const result = chaturAdapter.isPublicChatTabReady();
      expect(result).toBe(false);
    });

    it('should return false when tabs container does not exist', () => {
      // Setup only public chat tab
      const chatTabContents = createMockElement();
      chatTabContents.className = 'ChatTabContents TheatermodeChatDivChat';
      
      const msgListWrapper = createMockElement();
      msgListWrapper.className = 'msg-list-wrapper-split';
      
      const msgList = createMockElement();
      msgList.className = 'msg-list-fvm message-list';
      
      msgListWrapper.appendChild(msgList);
      chatTabContents.appendChild(msgListWrapper);
      document.body.appendChild(chatTabContents);
      
      const result = chaturAdapter.isPublicChatTabReady();
      expect(result).toBe(false);
    });

    it('should return false when neither element exists', () => {
      const result = chaturAdapter.isPublicChatTabReady();
      expect(result).toBe(false);
    });
  });

  describe('chaturAdapter object structure', () => {
    it('should export all expected methods', () => {
      expect(typeof chaturAdapter.getPublicChatTab).toBe('function');
      expect(typeof chaturAdapter.getChaturPvtChatTab).toBe('function');
      expect(typeof chaturAdapter.getTabsContainer).toBe('function');
      expect(typeof chaturAdapter.isPublicChatTabReady).toBe('function');
    });

    it('should have correct method signatures', () => {
      expect(chaturAdapter.getPublicChatTab.length).toBe(0);
      expect(chaturAdapter.getChaturPvtChatTab.length).toBe(0);
      expect(chaturAdapter.getTabsContainer.length).toBe(0);
      expect(chaturAdapter.isPublicChatTabReady.length).toBe(0);
    });
  });
});