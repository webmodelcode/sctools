import { useCallback } from "react";
import { SquareCheckBig } from "lucide-react";
import { MenuButton } from "../MenuButton/MenuButton";

export const SmChreckTerms = () => {
  const onclick = useCallback((): boolean => {
    const consentModal = document.querySelector(
      'div[data-ta-locator="ModelConsentModal__Modal"]'
    );
    if (!consentModal) return false;
    const checkboxes = consentModal.querySelectorAll("input[type=checkbox]");
    if (!checkboxes.length) return false;

    checkboxes.forEach((c) => {
      const elm = c as HTMLInputElement;
      elm.click();
    });

    return true;
  }, []);

  return (
    <MenuButton
      isToggle={false}
      ButtonIcon={<SquareCheckBig />}
      title="Check Streamate Terms"
      onClick={onclick}
    />
  );
};
