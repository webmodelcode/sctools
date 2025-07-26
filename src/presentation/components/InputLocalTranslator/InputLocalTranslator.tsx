import { useRef, useEffect } from "react";
import { useFocusedElement } from "../../hooks/useFocusedElement";
import { usePopupPosition } from "../../hooks/usePopupPosition";
import { useInputValue } from "../../hooks/useInputValue";
import { TranslatorPopup } from "./TranslatorPopup";

export const InputLocalTranslator = () => {
  const popupRef = useRef<HTMLDivElement>(null);
  const { focusedElement, isVisible, setIsVisible } = useFocusedElement();
  const position = usePopupPosition(focusedElement, isVisible);
  const inputValue = useInputValue(focusedElement);

  // Handle popup blur to hide when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        if (!focusedElement?.contains(event.target as Node)) {
          setIsVisible(false);
        }
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isVisible, focusedElement, setIsVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <TranslatorPopup
      ref={popupRef}
      position={position}
      inputValue={inputValue}
    />
  );
};
