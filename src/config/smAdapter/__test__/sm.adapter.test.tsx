import { describe, it, expect, beforeEach, vi } from 'vitest';
import { smAdapter } from '../sm.adapter';

// Mock DOM elements helper
const createMockElement = (tagName: string = 'div') => {
  return document.createElement(tagName);
};

describe('smAdapter', () => {
  // Clear all mocks after each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Clear the virtual DOM for each test
    document.body.innerHTML = '';
  });

  describe('getConsentModal', () => {
    it('should return null when the modal does not exist', () => {
      // Arrange: No elements in the DOM
      
      // Act: Call the function
      const result = smAdapter.getConsentModal();
      
      // Assert: Verify that it returns null
      expect(result).toBeNull();
    });

    it('should return the modal element when it exists', () => {
      // Arrange: Create the modal element in the DOM
      const modalElement = document.createElement('div');
      modalElement.setAttribute('data-ta-locator', 'IcfModal');
      document.body.appendChild(modalElement);
      
      // Act: Call the function
      const result = smAdapter.getConsentModal();
      
      // Assert: Verify that it returns the correct element
      expect(result).toBe(modalElement);
    });
  });

  describe('getConsentCheckbox', () => {
    it('should return undefined when the modal does not exist', () => {
      // Arrange: No elements in the DOM
      
      // Act: Call the function
      const result = smAdapter.getConsentCheckbox();
      
      // Assert: Verify that it returns undefined
      expect(result).toBeUndefined();
    });

    it('should return NodeList of checkboxes when they exist', () => {
      // Arrange: Create the modal and checkboxes
      const modalElement = document.createElement('div');
      modalElement.setAttribute('data-ta-locator', 'IcfModal');
      
      // Create two checkboxes inside the modal
      const checkbox1 = document.createElement('input');
      checkbox1.type = 'checkbox';
      const checkbox2 = document.createElement('input');
      checkbox2.type = 'checkbox';
      
      modalElement.appendChild(checkbox1);
      modalElement.appendChild(checkbox2);
      document.body.appendChild(modalElement);
      
      // Act: Call the function
      const result = smAdapter.getConsentCheckbox();
      
      // Assert: Verify that it returns the checkboxes
      expect(result).toBeDefined();
      expect(result?.length).toBe(2);
      expect(result?.[0]).toBe(checkbox1);
      expect(result?.[1]).toBe(checkbox2);
    });
  });

  describe('getConsentButton', () => {
    it('should return undefined when the modal does not exist', () => {
      // Arrange: No elements in the DOM
      
      // Act: Call the function
      const result = smAdapter.getConsentButton();
      
      // Assert: Verify that it returns undefined
      expect(result).toBeUndefined();
    });

    it('should return null when the modal exists but there is no button', () => {
      // Arrange: Create the modal without a button
      const modalElement = document.createElement('div');
      modalElement.setAttribute('data-ta-locator', 'IcfModal');
      document.body.appendChild(modalElement);
      
      // Act: Call the function
      const result = smAdapter.getConsentButton();
      
      // Assert: Verify that it returns null
      expect(result).toBeNull();
    });

    it('should return the button when it exists', () => {
      // Arrange: Create the modal and the button
      const modalElement = document.createElement('div');
      modalElement.setAttribute('data-ta-locator', 'IcfModal');
      
      const buttonElement = document.createElement('button');
      buttonElement.setAttribute('data-icf-click', 'ModelConsentModal__Accept');
      
      modalElement.appendChild(buttonElement);
      document.body.appendChild(modalElement);
      
      // Act: Call the function
      const result = smAdapter.getConsentButton();
      
      // Assert: Verify that it returns the correct button
      expect(result).toBe(buttonElement);
    });
  });

  describe('getChatTab', () => {
    it('should return null when the chat tab does not exist', () => {
      // Arrange: No elements in the DOM
      
      // Act: Call the function
      const result = smAdapter.getChatTab();
      
      // Assert: Verify that it returns null
      expect(result).toBeNull();
    });

    it('should return the chat tab element when it exists', () => {
      // Arrange: Create the chat tab element in the DOM
      const chatTabElement = createMockElement('div');
      chatTabElement.setAttribute('data-ta-locator', 'ChatDisplay__Display');
      document.body.appendChild(chatTabElement);
      
      // Act: Call the function
      const result = smAdapter.getChatTab();
      
      // Assert: Verify that it returns the correct element
      expect(result).toBe(chatTabElement);
    });

    it('should return the first chat tab when multiple exist', () => {
      // Arrange: Create multiple chat tab elements
      const chatTab1 = createMockElement('div');
      chatTab1.setAttribute('data-ta-locator', 'ChatDisplay__Display');
      chatTab1.setAttribute('data-test-id', 'first');
      
      const chatTab2 = createMockElement('div');
      chatTab2.setAttribute('data-ta-locator', 'ChatDisplay__Display');
      chatTab2.setAttribute('data-test-id', 'second');
      
      document.body.appendChild(chatTab1);
      document.body.appendChild(chatTab2);
      
      // Act: Call the function
      const result = smAdapter.getChatTab();
      
      // Assert: Verify that it returns the first element
      expect(result).toBe(chatTab1);
      expect(result?.getAttribute('data-test-id')).toBe('first');
    });
  });

  describe('smAdapter object structure', () => {
    it('should export all expected methods', () => {
      expect(typeof smAdapter.getConsentModal).toBe('function');
      expect(typeof smAdapter.getConsentCheckbox).toBe('function');
      expect(typeof smAdapter.getConsentButton).toBe('function');
      expect(typeof smAdapter.getChatTab).toBe('function');
    });

    it('should have correct method signatures', () => {
      expect(smAdapter.getConsentModal.length).toBe(0);
      expect(smAdapter.getConsentCheckbox.length).toBe(0);
      expect(smAdapter.getConsentButton.length).toBe(0);
      expect(smAdapter.getChatTab.length).toBe(0);
    });

    it('should have all methods return expected types', () => {
      // Test with empty DOM
      expect(smAdapter.getConsentModal()).toBeNull();
      expect(smAdapter.getConsentCheckbox()).toBeUndefined();
      expect(smAdapter.getConsentButton()).toBeUndefined();
      expect(smAdapter.getChatTab()).toBeNull();
    });
  });

  describe('integration tests', () => {
    it('should work with complete modal structure', () => {
      // Arrange: Create a complete modal with all elements
      const modalElement = createMockElement('div');
      modalElement.setAttribute('data-ta-locator', 'IcfModal');
      
      const checkbox1 = createMockElement('input') as HTMLInputElement;
      checkbox1.type = 'checkbox';
      const checkbox2 = createMockElement('input') as HTMLInputElement;
      checkbox2.type = 'checkbox';
      
      const buttonElement = createMockElement('button');
      buttonElement.setAttribute('data-icf-click', 'ModelConsentModal__Accept');
      
      modalElement.appendChild(checkbox1);
      modalElement.appendChild(checkbox2);
      modalElement.appendChild(buttonElement);
      document.body.appendChild(modalElement);
      
      // Act & Assert: Test all related functions
      expect(smAdapter.getConsentModal()).toBe(modalElement);
      expect(smAdapter.getConsentCheckbox()?.length).toBe(2);
      expect(smAdapter.getConsentButton()).toBe(buttonElement);
    });

    it('should handle partial modal structure gracefully', () => {
      // Arrange: Create modal with only some elements
      const modalElement = createMockElement('div');
      modalElement.setAttribute('data-ta-locator', 'IcfModal');
      
      const checkbox = createMockElement('input') as HTMLInputElement;
      checkbox.type = 'checkbox';
      modalElement.appendChild(checkbox);
      // Note: No button added
      
      document.body.appendChild(modalElement);
      
      // Act & Assert: Test graceful handling
      expect(smAdapter.getConsentModal()).toBe(modalElement);
      expect(smAdapter.getConsentCheckbox()?.length).toBe(1);
      expect(smAdapter.getConsentButton()).toBeNull();
    });
  });
});