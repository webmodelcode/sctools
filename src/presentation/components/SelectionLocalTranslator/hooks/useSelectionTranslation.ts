import { useCallback, useState } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

export type TranslationStatus = "idle" | "translating" | "done" | "error";

export interface UseSelectionTranslationReturn {
  status: TranslationStatus;
  translatedText: string | null;
  sourceLanguage: string | null;
  errorMessage?: string;
  translate: (text: string, targetLanguage: string) => Promise<void>;
  reset: () => void;
}

interface SelectionMessageResponse {
  translatedText: string;
  sourceLanguage: string;
}

export const useSelectionTranslation = (): UseSelectionTranslationReturn => {
  const [status, setStatus] = useState<TranslationStatus>("idle");
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const translate = useCallback(
    async (text: string, targetLanguage: string): Promise<void> => {
      setStatus("translating");
      setTranslatedText(null);
      setSourceLanguage(null);
      setErrorMessage(undefined);

      return new Promise((resolve) => {
        browser.runtime.sendMessage(
          {
            type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.SELECTION_MESSAGE,
            data: text,
            target: targetLanguage,
          },
          (response: SelectionMessageResponse | undefined) => {
            if (!response) {
              setStatus("error");
              setErrorMessage("Translation unavailable");
              return resolve();
            }
            setTranslatedText(response.translatedText);
            setSourceLanguage(response.sourceLanguage);
            setStatus("done");
            resolve();
          },
        );
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setTranslatedText(null);
    setSourceLanguage(null);
    setErrorMessage(undefined);
  }, []);

  return {
    status,
    translatedText,
    sourceLanguage,
    errorMessage,
    translate,
    reset,
  };
};
