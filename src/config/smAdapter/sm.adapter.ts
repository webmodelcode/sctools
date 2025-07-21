/**
 * Adapter for interacting with the DOM elements of the StripChat website.
 * This module provides utility functions to query and manipulate DOM elements
 * based on predefined class names and IDs.
 *
 * @module Config/SmAdapter
 */

const getConsentModal = (): HTMLDivElement | null =>
  document.querySelector('div[data-ta-locator="IcfModal"]');

const getConsentCheckbox = (): NodeListOf<Element> | undefined =>
  getConsentModal()?.querySelectorAll("input[type=checkbox]");

const getConsentButton = (): HTMLButtonElement | null | undefined =>
  getConsentModal()?.querySelector(
    'button[data-icf-click="ModelConsentModal__Accept"]'
  );

export const smAdapter = {
  /**
   *
   * @returns {HTMLDivElement | null} - The DOM element for checking consent or null.
   */
  getConsentModal,
  /**
   *
   * @returns {NodeListOf<Element> | undefined} - All the checkbox elements in the consent modal.
   */
  getConsentCheckbox,
  /**
   *
   * @returns {HTMLButtonElement | null | undefined} - Button element for accepting consent.
   */
  getConsentButton,
};
