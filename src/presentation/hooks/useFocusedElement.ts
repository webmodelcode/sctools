import { useState, useEffect } from "react";
import { isEditableElement } from "~@/config/utils/isTextElement";

export const useFocusedElement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement;

      if (!isEditableElement(target)) return;

      setFocusedElement(target);
      setIsVisible(true);
    };

    const handleBlur = (event: Event) => {
      const target = event.target as HTMLElement;
      setTimeout(() => {
        if (
          !document.activeElement ||
          !isEditableElement(document.activeElement as HTMLElement)
        ) {
          setIsVisible(false);
          setFocusedElement(null);
        }
      }, 100);
    };

    document.addEventListener("focusin", handleFocus, true);
    document.addEventListener("focusout", handleBlur, true);

    return () => {
      document.removeEventListener("focusin", handleFocus, true);
      document.removeEventListener("focusout", handleBlur, true);
    };
  }, []);

  return { focusedElement, isVisible, setIsVisible };
};
