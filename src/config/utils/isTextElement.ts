/**
 * Utility function for check if a element is editable.
 * @param element {Element}
 * @returns {boolean}
 */

export const isEditableElement = (element: Element | HTMLElement): boolean => {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
};
