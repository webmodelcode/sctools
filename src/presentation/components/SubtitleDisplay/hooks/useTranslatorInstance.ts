import { useEffect, useRef, useState } from "react";
import { localTranslator } from "~@/infrastructure/datasource/chromeTranslator.local.datasource";
import { devConsole } from "~@/config/utils/developerUtils";

interface UseTranslatorInstanceResult {
  translatorRef: React.RefObject<Translator | null>;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initTranslator = async () => {
      if (!localTranslator.isAvailable()) {
        setError("Translator API no disponible. Requiere Chrome 138+.");
        return;
      }
      try {
        const translator = await localTranslator.create({
          sourceLanguage,
          targetLanguage,
        });
        if (mounted) translatorRef.current = translator;
      } catch (err) {
        devConsole.error((err as Error).message);
        if (mounted) setError("Error al inicializar el traductor.");
      }
    };

    initTranslator();
    return () => {
      mounted = false;
    };
  }, [sourceLanguage, targetLanguage]);

  return { translatorRef, error };
};
