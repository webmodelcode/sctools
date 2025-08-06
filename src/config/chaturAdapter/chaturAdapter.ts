/**
 * Returns the first public chat tab element from the chat tab contents in theater mode.
 *
 * @returns {Element | undefined} The first matching chat tab element, or undefined if not found.
 */
const getPublicChatTab = () =>
  document.querySelectorAll(
    "div.ChatTabContents.TheatermodeChatDivChat div.msg-list-wrapper-split div.msg-list-fvm.message-list",
  )[0];

const getChaturPvtChatTab = () =>
  document.querySelectorAll(
    "div.ChatTabContents.TheatermodeChatDivPm div.msg-list-wrapper-split div.msg-list-fvm.message-list",
  )[0];

const getTabsContainer = () =>
  document.querySelector("div#ChatTabContainer.BaseTabsContainer");

/**
 * Checks if the public chat tab elements are ready.
 *
 * @returns {boolean} True if the public chat tab elements are ready, false otherwise.
 */
const isPublicChatTabReady = () => {
  const publicChatTab = getPublicChatTab();
  const tabsContainer = getTabsContainer();
  return !!publicChatTab && !!tabsContainer;
};

export const chaturAdapter = {
  getPublicChatTab,
  getChaturPvtChatTab,
  getTabsContainer,
  isPublicChatTabReady,
};
