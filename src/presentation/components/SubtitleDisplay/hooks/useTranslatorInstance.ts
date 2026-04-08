import { useCallback, useEffect, useRef, useState } from "react";
import { localTranslator } from "~@/infrastructure/datasource/chromeTranslator.local.datasource";
import { devConsole } from "~@/config/utils/developerUtils";

export type TranslatorErrorKind = "user-gesture-required" | "unavailable" | "generic";
export type TranslatorError = { kind: TranslatorErrorKind; message: string };

interface UseTranslatorInstanceResult {
  translatorRef: React.RefObject<Translator | null>;
  error: TranslatorError | null;
  retry: (onProgress?: (loaded: number) => void) => Promise<void>;
}

function classifyError(err: unknown): TranslatorError {
  if (err instanceof DOMException && err.name === "NotAllowedError") {
    return { kind: "user-gesture-required", message: err.message };
  }
  return { kind: "generic", message: "Error al inicializar el traductor." };
}

/**
 * Manages the Translator API instance lifecycle.
 * Re-creates the translator whenever `targetLanguage` changes.
 */
export const useTranslatorInstance = (
  sourceLanguage: string,
  targetLanguage: string,
): UseTranslatorInstanceResult => {
  const translatorRef = useRef<Translator | null>(null);
  const [error, setError] = useState<TranslatorError | null>(null);

  useEffect(() => {
    let mounted = true;

    const initTranslator = async () => {
      if (!localTranslator.isAvailable()) {
        setError({ kind: "unavailable", message: "Translator API no disponible. Requiere Chrome 138+." });
        return;
      }
      try {
        const translator = await localTranslator.create({ sourceLanguage, targetLanguage });
        if (mounted) translatorRef.current = translator;
      } catch (err) {
        devConsole.error((err as Error).message);
        if (mounted) setError(classifyError(err));
      }
    };

    initTranslator();
    return () => {
      mounted = false;
    };
  }, [sourceLanguage, targetLanguage]);

  const retry = useCallback(
    async (onProgress?: (loaded: number) => void) => {
      setError(null);
      try {
        const translator = await localTranslator.create({ sourceLanguage, targetLanguage, onProgress });
        translatorRef.current = translator;
      } catch (err) {
        devConsole.error((err as Error).message);
        setError(classifyError(err));
      }
    },
    [sourceLanguage, targetLanguage],
  );

  return { translatorRef, error, retry };
};
