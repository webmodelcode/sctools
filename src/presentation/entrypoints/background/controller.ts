import { localLanguageDetector } from "~@/infrastructure/datasource/chromeLanguageDetector.local.datasource";
import { localTranslator } from "~@/infrastructure/datasource/chromeTranslator.local.datasource";

/**
 * Controller for handling background chat message translation.
 *
 * Provides an async method to translate incoming chat messages from English to Spanish
 * using the internal localTranslator module, if available.
 *
 * @property handleChatMessage - Translates a given message string from English to Spanish.
 * @param message - The chat message to be translated.
 * @returns The translated message if translation is available; otherwise, undefined.
 */

export const backgroundController = {
  handleChatMessage: async (message: string) => {
    if (localTranslator.isAvailable() && localLanguageDetector.isAvailable()) {
      const detectedLanguage =
        await localLanguageDetector.detectLanguage(message);
      const translator = await localTranslator.create({
        sourceLanguage: detectedLanguage ?? "en",
        targetLanguage: "es",
      });
      const msg = await translator.translate(message);

      return msg;
    }
  },
  handleInputMessage: async (message: string, target?: string) => {
    if (localTranslator.isAvailable()) {
      const translator = await localTranslator.create({
        sourceLanguage: "es",
        targetLanguage: target ?? "en",
      });
      const msg = await translator.translate(message);

      return msg;
    }
  },
};
