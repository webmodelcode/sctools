import { useState, useEffect } from "react";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";
import { LanguageSelectorControlled } from "./LanguageSelectorControlled";

export const LanguageSelector = () => {
  const { setItem, getItem, watchItem } = useLocalTranslatorTargetLanguage();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    getItem().then(setValue);
  }, []);

  watchItem(setValue);

  const handleChange = async (lang: string) => {
    await setItem(lang);
  };

  return <LanguageSelectorControlled value={value} onChange={handleChange} />;
};
