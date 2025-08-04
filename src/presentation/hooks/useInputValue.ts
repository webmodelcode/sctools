import { useState, useEffect } from "react";
import { isEditableElement } from "~@/config/utils/isTextElement";

const extractElementValue = (element: HTMLElement): string => {
  if (isEditableElement(element)) {
    const value =
      (element as HTMLInputElement | HTMLTextAreaElement).value ??
      element.textContent;
    return value;
  }
  if (element.contentEditable === "true") {
    return element.textContent || "";
  }
  return "";
};

export const useInputValue = (element: HTMLElement | null) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!element) {
      setInputValue("");
      return;
    }

    // Set initial value
    setInputValue(extractElementValue(element));

    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target === element) {
        setInputValue(extractElementValue(target));
      }
    };

    document.addEventListener("input", handleInput, true);

    return () => {
      document.removeEventListener("input", handleInput, true);
    };
  }, [element]);

  return inputValue;
};
