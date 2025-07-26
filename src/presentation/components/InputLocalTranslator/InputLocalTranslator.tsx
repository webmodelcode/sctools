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
