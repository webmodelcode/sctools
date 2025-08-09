/**
 * Adapter for interacting with the DOM elements of the StripChat website.
 * This module provides utility functions to query and manipulate DOM elements
 * based on predefined class names and IDs.
 *
 * @module Config/ScAdapter
 */

import { devConsole } from "../utils/developerUtils";
import { ScClasses } from "./sc.interfaces";
import { SC_STRINGS } from "./sc.strings";

/**
 * Retrieves a DOM element by its class name.
 *
 * @param {string} elmClass - The class name of the element to retrieve.
 * @returns {Element | null} - The DOM element or null if not found.
 *
 */
const getScElementByClassName = (elmClass: ScClasses) => {
  try {
    return document.getElementsByClassName(elmClass).item(0) || null;
  } catch (error) {
    devConsole.error(error as Error);
    return null;
  }
};

const getScMultipleElementsByClassName = (elmClass: ScClasses) => {
  try {
    return document.getElementsByClassName(elmClass);
  } catch (error) {
    devConsole.error(error as Error);
    return [];
  }
};

/**
 * Retrieves a DOM element by its ID.
 *
 * @param {string} elmID - The ID of the element to retrieve.
 * @returns {HTMLElement | null} - The DOM element or null if not found.
 */
const getScElementById = (elmID: string) => {
  try {
    return document.getElementById(elmID) || null;
  } catch (error) {
    devConsole.error(error as Error);
    return null;
  }
};

const isScElementsReady = () => {
  const scClassElements = SC_STRINGS.SC_CLASSES;
  const scIdElements = SC_STRINGS.SC_IDS;

  const classElementsValidation = scClassElements.every((elmClass) => {
    if (!getScElementByClassName(elmClass)) {
      return false;
    }
    return true;
  });

  const idElementsValidation = scIdElements.every((elmId) => {
    if (!getScElementById(elmId)) {
      return false;
    }
    return true;
  });

  return classElementsValidation && idElementsValidation;
};

const isScErrorNode = (node: Node) => {
  try {
    return (node as HTMLElement).innerHTML
      .toLocaleLowerCase()
      .includes("loadableerrorboundary");
  } catch (error) {
    devConsole.error(error as Error);
    return false;
  }
};

export const scAdapter = {
  /**
   * @param {string} elmClass - The class name of the element to retrieve.
   * @returns {Element | null} - The DOM element or null if not found.
   */
  getScElementByClassName,

  /**
   * @param {string} elmClass - The class name of the elements to retrieve.
   * @returns {HTMLCollectionOf<Element>} - The DOM elements or an empty array if not found.
   */
  getScMultipleElementsByClassName,
  /**
   * @param {string} elmID - The ID of the element to retrieve.
   * @returns {HTMLElement | null} - The DOM element or null if not found.
   */
  getScElementById,
  /**
   * @returns {boolean} - True if all required elements are found, false otherwise.
   */
  isScElementsReady,
  /**
   * Checks if a given DOM node represents an error in the StripChat application.
   * This function is based in the existence of a Div in the stripchat website.
   *
   * @param {Node} node - The DOM node to check.
   * @returns {boolean} - True if the node represents an error, false otherwise.
   *
   */
  isScErrorNode,
};
