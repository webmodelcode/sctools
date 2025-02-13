import { useCallback } from "react";
import { SquareCheckBig } from "lucide-react";
import { MenuButton } from "../MenuButton/MenuButton";
import { smAdapter } from "@/config";

export const SmChreckTerms = () => {
  const alertMessage = () =>
    window.alert(
      "This button is only to accept the consent when starting stream "
    );
  const onclick = useCallback((): boolean => {
    const consentModal = smAdapter.getConsentModal();
    if (!consentModal) {
      alertMessage();
      return false;
    }
    const checkboxes = smAdapter.getConsentCheckbox();
    if (!checkboxes?.length) {
      alertMessage();
      return false;
    }

    checkboxes.forEach((c) => {
      const elm = c as HTMLInputElement;
      elm.click();
    });

    const button = smAdapter.getConsentButton();
    if (!button) return false;
    button.click();

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
