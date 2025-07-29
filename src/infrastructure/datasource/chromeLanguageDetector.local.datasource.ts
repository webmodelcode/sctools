/**
 * Provides methods to detect language support in the current environment and to create a LanguageDetector instance.
 * The `isAvailable` method checks for the presence of the LanguageDetector API.
 * The `create` method asynchronously initializes a LanguageDetector and attaches a monitor to log download progress.
 * The `detectLanguage` method asynchronously detects the language of a given text using the LanguageDetector instance.
 */

export const localLanguageDetector = {
  isAvailable: () => "LanguageDetector" in self,
  create: async () => {
    const detector = await LanguageDetector.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded * 100}%`);
        });
      },
    });
    return detector;
  },
  detectLanguage: async (text: string) => {
    const detector = await localLanguageDetector.create();
    const detectedLanguage = await detector.detect(text);
    return detectedLanguage.at(0)?.detectedLanguage;
  },
};
