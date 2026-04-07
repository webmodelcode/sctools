import { useCallback, useEffect, useState } from "react";
import { useQuickMessagesStatus } from "../useQuickMessagesStatus/useQuickMessagesStatus";
import { useQuickMenuIsActive } from "../useQuickMenuIsActive/useQuickMenuIsActive";
import { useTranslatorStatus } from "../useTranslatorStatus/useTranslatorStatus";
import { useSpeechToTranslateStatus } from "../useSpeechToTranslateStatus/useSpeechToTranslateStatus";
import { useSpeechToTranslateTabId } from "../useSpeechToTranslateTabId/useSpeechToTranslateTabId";

interface FeatureStatus {
  isEnabled: boolean;
  toggle: (checked: boolean) => Promise<void>;
}

interface UseFeaturesStatus {
  translator: FeatureStatus;
  quickMessages: FeatureStatus;
  quickMenu: FeatureStatus;
  speechToTranslate: FeatureStatus;
  isInitialized: boolean;
}

/**
 * Hook to consolidate and manage the status of all application features.
 *
 * @returns {UseFeaturesStatus} Object containing status and toggle handlers for each feature.
 */
export const useFeaturesStatus = (): UseFeaturesStatus => {
  const translatorStatus = useTranslatorStatus();
  const quickMessagesStatus = useQuickMessagesStatus();
  const quickMenuIsActive = useQuickMenuIsActive();
  const speechToTranslateStatusStorage = useSpeechToTranslateStatus();
  const speechToTranslateTabIdStorage = useSpeechToTranslateTabId();

  const [isTranslatorEnabled, setIsTranslatorEnabled] = useState(false);
  const [isQuickMessagesEnabled, setIsQuickMessagesEnabled] = useState(false);
  const [isQuickMenuEnabled, setIsQuickMenuEnabled] = useState(false);
  const [isSpeechToTranslateEnabled, setIsSpeechToTranslateEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initFeaturesState = useCallback(async () => {
    if (isInitialized) return;

    const [translator, quickMessages, quickMenu, speechToTranslate] = await Promise.all([
      translatorStatus.getItem(),
      quickMessagesStatus.getItem(),
      quickMenuIsActive.getItem(),
      speechToTranslateStatusStorage.getItem(),
    ]);

    setIsTranslatorEnabled(translator);
    setIsQuickMessagesEnabled(quickMessages);
    setIsQuickMenuEnabled(quickMenu);
    setIsSpeechToTranslateEnabled(speechToTranslate);
    setIsInitialized(true);
  }, [isInitialized, translatorStatus, quickMessagesStatus, quickMenuIsActive, speechToTranslateStatusStorage]);

  useEffect(() => {
    initFeaturesState();

    translatorStatus.watchItem((value) => setIsTranslatorEnabled(value));
    quickMessagesStatus.watchItem((value) => setIsQuickMessagesEnabled(value));
    quickMenuIsActive.watchItem((value) => setIsQuickMenuEnabled(value));
    speechToTranslateStatusStorage.watchItem((value) => setIsSpeechToTranslateEnabled(value));
  }, [
    initFeaturesState,
    translatorStatus,
    quickMessagesStatus,
    quickMenuIsActive,
    speechToTranslateStatusStorage,
  ]);

  const toggleTranslator = useCallback(
    async (checked: boolean) => {
      await translatorStatus.setItem(checked);
      setIsTranslatorEnabled(checked);
    },
    [translatorStatus],
  );

  const toggleQuickMessages = useCallback(
    async (checked: boolean) => {
      await quickMessagesStatus.setItem(checked);
      setIsQuickMessagesEnabled(checked);
    },
    [quickMessagesStatus],
  );

  const toggleQuickMenu = useCallback(
    async (checked: boolean) => {
      await quickMenuIsActive.setItem(checked);
      setIsQuickMenuEnabled(checked);
    },
    [quickMenuIsActive],
  );

  const toggleSpeechToTranslate = useCallback(
    async (checked: boolean) => {
      if (checked) {
        const tab = await browser.tabs.create({
          // WXT path types are regenerated on build; cast needed for unlisted pages
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          url: browser.runtime.getURL("/subtitleDisplay.html" as any),
        });
        if (tab.id !== undefined) {
          await speechToTranslateTabIdStorage.setItem(tab.id);
        }
        await speechToTranslateStatusStorage.setItem(true);
        setIsSpeechToTranslateEnabled(true);
      } else {
        const tabId = await speechToTranslateTabIdStorage.getItem();
        if (tabId !== null) {
          await browser.tabs.remove(tabId);
        }
        await speechToTranslateStatusStorage.setItem(false);
        await speechToTranslateTabIdStorage.setItem(null);
        setIsSpeechToTranslateEnabled(false);
      }
    },
    [speechToTranslateStatusStorage, speechToTranslateTabIdStorage],
  );

  return {
    translator: {
      isEnabled: isTranslatorEnabled,
      toggle: toggleTranslator,
    },
    quickMessages: {
      isEnabled: isQuickMessagesEnabled,
      toggle: toggleQuickMessages,
    },
    quickMenu: {
      isEnabled: isQuickMenuEnabled,
      toggle: toggleQuickMenu,
    },
    speechToTranslate: {
      isEnabled: isSpeechToTranslateEnabled,
      toggle: toggleSpeechToTranslate,
    },
    isInitialized,
  };
};
