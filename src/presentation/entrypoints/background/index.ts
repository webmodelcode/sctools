import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { localTranslator } from "~@/infrastructure/datasource/chromeTranslator.local.datasource";
import { backgroundController } from "./controller";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHAT_MESSAGE:
        (async () => {
          const result = await backgroundController.handleChatMessage(
            message.data,
          );
          sendResponse(result);
        })();
        break;
      case GLOBAL_STRINGS.BG_MESSAGE_TYPE.INPUT_MESSAGE:
        (async () => {
          const result = await backgroundController.handleInputMessage(
            message.data,
          );
          sendResponse(result);
        })();
        break;
      default:
        break;
    }

    return true; // Indicates that the response will be sent asynchronously
  });
});
