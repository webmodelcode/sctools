import { describe, it, expect, beforeEach, vi } from 'vitest';
import { smAdapter } from '../sm.adapter';

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
      
      // Act: Llamar a la función
      const result = smAdapter.getConsentButton();
      
      // Assert: Verificar que devuelve el botón correcto
      expect(result).toBe(buttonElement);
    });
  });
});