/**
 *
 * @returns The PublicChatTab Element from the model view.
 */
const getPublicChatTab = () =>
  document.querySelector("div.chat-module__wrapper--Pjvd2");

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
};
