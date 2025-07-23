import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHAT_MESSAGE:
        if ("Translator" in self) {
          setTimeout(async () => {
            const translator = await Translator.create({
              sourceLanguage: "en",
              targetLanguage: "es",
              monitor(m) {
                m.addEventListener("downloadprogress", (e) => {
                  console.log(`Downloaded ${e.loaded * 100}%`);
                });
              },
            });
            const msg = await translator.translate(message.data);

            sendResponse(msg);
          }, 5);
        }
      case GLOBAL_STRINGS.BG_MESSAGE_TYPE.INPUT_MESSAGE:
        break;
      default:
        break;
    }

    return true; // Indicates that the response will be sent asynchronously
  });
});
