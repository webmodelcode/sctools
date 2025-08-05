import { compareSemanticVersions } from "~@/config/utils/compareSemanticVersions";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
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
    try {
      if (
        localTranslator.isAvailable() &&
        localLanguageDetector.isAvailable()
      ) {
        if (!message) return;
        const detectedLanguage =
          await localLanguageDetector.detectLanguage(message);
        if (detectedLanguage === "es") return;
        const translator = await localTranslator.create({
          sourceLanguage: detectedLanguage ?? "en",
          targetLanguage: "es",
        });
        const msg = await translator.translate(message);

        return msg;
      }
    } catch (error) {
      console.error("Error translating message:", error);
      return;
    }
  },
  handleInputMessage: async (message: string, target?: string) => {
    if (localTranslator.isAvailable()) {
      const translator = await localTranslator.create({
        sourceLanguage: "es",
        targetLanguage: target || "en",
      });
      const msg = await translator.translate(message);

      return msg;
    }
  },
  handleCheckExtUpload: async () => {
    const isProd = import.meta.env.PROD;
    const currentVersion = browser.runtime.getManifest().version;
    const baseUrl = isProd
      ? GLOBAL_STRINGS.ESTRELLAS_WEB_BASEURL.PRODUCTION
      : GLOBAL_STRINGS.ESTRELLAS_WEB_BASEURL.DEV;
    const { version: latestVersion, link: downloadUrl } = await fetch(
      `${baseUrl}/downloads/sctools/metadata.json`,
    ).then((res) => res.json());
    const isUpdateAvailable = compareSemanticVersions(
      latestVersion,
      currentVersion,
    );

    if (isUpdateAvailable) {
      return {
        latestVersion,
        downloadUrl: `${baseUrl}/descargas`,
      };
    }
  },
};
