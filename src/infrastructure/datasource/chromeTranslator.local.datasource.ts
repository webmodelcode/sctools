import { devConsole } from "~@/config/utils/developerUtils";

interface ILocalTranslator {
  sourceLanguage: string;
  targetLanguage: string;
  onProgress?: (loaded: number) => void;
}

/**
 * Provides methods to check for the availability of the Translator API and to create a Translator instance
 * for translating between specified source and target languages. Monitors download progress during creation.
 *
 * @property isAvailable Checks if the Translator API is available in the current environment.
 * @property isModelAvailable Checks if the Translator model is available in the current environment.
 * @property create Asynchronously creates a Translator instance with the given source and target languages,
 *                  and logs download progress to the console.
 *
 * @param sourceLanguage The language code of the source language.
 * @param targetLanguage The language code of the target language.
 * @returns A Promise that resolves to a Translator instance.
 */

const isModelAvailable = async ({
  sourceLanguage,
  targetLanguage,
}: ILocalTranslator): Promise<string> => {
  const translatorCapabilities = await Translator.availability({
    sourceLanguage,
    targetLanguage,
  });
  return translatorCapabilities;
};

export const localTranslator = {
  isAvailable: () => "Translator" in globalThis,
  isModelAvailable: isModelAvailable,
  create: async ({
    sourceLanguage,
    targetLanguage,
    onProgress,
  }: ILocalTranslator): Promise<Translator> => {
    const isAvailable = await isModelAvailable({
      sourceLanguage,
      targetLanguage,
    });
    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor(m) {
        if (isAvailable === "available") return;
        m.addEventListener("downloadprogress", (e) => {
          devConsole.log(`Downloaded ${e.loaded * 100}%`);
          onProgress?.(e.loaded);
        });
      },
    });
    return translator;
  },
};
