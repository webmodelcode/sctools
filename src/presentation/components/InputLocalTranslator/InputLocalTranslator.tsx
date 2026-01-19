import { useRef } from "react";
import { useFocusedElement } from "../../hooks/useFocusedElement";
import { usePopupPosition } from "../../hooks/usePopupPosition";
import { useInputValue } from "../../hooks/useInputValue";
import { TranslatorPopup } from "./TranslatorPopup";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";

export const InputLocalTranslator = () => {
  const { translator } = useFeaturesStatus();
  const popupRef = useRef<HTMLDivElement>(null);
  const { focusedElement, isVisible } = useFocusedElement();
  const position = usePopupPosition(focusedElement, isVisible);
  const inputValue = useInputValue(focusedElement);

  if (!translator.isEnabled || !isVisible) return;

  return (
    <TranslatorPopup
      ref={popupRef}
      position={position}
      inputValue={inputValue}
    />
  );
};
