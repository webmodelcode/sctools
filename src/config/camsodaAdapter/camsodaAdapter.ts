/**
 *
 * @returns The PublicChatTab Element from the model view.
 */
const getPublicChatTab = () =>
  document.querySelector("div.chat-module__wrapper--Pjvd2");

const getMessengerContainer = () =>
  document.querySelector(
    "div.index-module__utils--xaGvR.browser-module__iframedHide--qakrm",
  );

const getMessengerChatWrapper = () =>
  document.querySelectorAll("div.wrapper-module__content--pr0TQ > div");

/**
 * Checks if the public chat tab elements are ready.
 *
 * @returns {boolean} True if the public chat tab elements are ready, false otherwise.
 */
const isPublicChatTabReady = () => {
  const publicChatTab = getPublicChatTab();
  return !!publicChatTab;
};

export const camsodaAdapter = {
  getPublicChatTab,
  isPublicChatTabReady,
  getMessengerContainer,
  getMessengerChatWrapper,
};
