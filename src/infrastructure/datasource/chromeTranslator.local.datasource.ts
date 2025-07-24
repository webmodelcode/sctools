export interface LocalTranslatorCreateParams {
  sourceLanguage: string;
  targetLanguage: string;
}

/**
 * Provides methods to check for the availability of the Translator API and to create a Translator instance
 * for translating between specified source and target languages. Monitors download progress during creation.
 *
 * @property isAvailable Checks if the Translator API is available in the current environment.
 * @property create Asynchronously creates a Translator instance with the given source and target languages,
 *                  and logs download progress to the console.
 *
 * @param sourceLanguage The language code of the source language.
 * @param targetLanguage The language code of the target language.
 * @returns A Promise that resolves to a Translator instance.
 */

export const localTranslator = {
  isAvailable: () => "Translator" in self,
  create: async ({
    sourceLanguage,
    targetLanguage,
  }: LocalTranslatorCreateParams): Promise<Translator> => {
    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });
    return translator;
  },
};
