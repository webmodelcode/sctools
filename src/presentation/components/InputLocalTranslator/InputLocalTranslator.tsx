import { useRef, useEffect, useState } from "react";
import { useFocusedElement } from "../../hooks/useFocusedElement";
import { usePopupPosition } from "../../hooks/usePopupPosition";
import { useInputValue } from "../../hooks/useInputValue";
import { TranslatorPopup } from "./TranslatorPopup";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";

export const InputLocalTranslator = () => {
  const { getItem, watchItem } = useQuickMenuIsActive();
  const popupRef = useRef<HTMLDivElement>(null);
  const { focusedElement, isVisible } = useFocusedElement();
  const position = usePopupPosition(focusedElement, isVisible);
  const inputValue = useInputValue(focusedElement);
  const [isExtActive, setIsExtActive] = useState(false);

  watchItem((value) => {
    setIsExtActive(value);
  });

  useEffect(() => {
    (async () => {
      setIsExtActive(await getItem());
    })();
  }, [getItem]);

  if (!isExtActive || !isVisible) return;

  return (
    <TranslatorPopup
      ref={popupRef}
      position={position}
      inputValue={inputValue}
    />
  );
};
