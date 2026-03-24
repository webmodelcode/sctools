import { useCallback, useEffect, useState } from "react";
import { useQuickMessagesStatus } from "../useQuickMessagesStatus/useQuickMessagesStatus";
import { useQuickMenuIsActive } from "../useQuickMenuIsActive/useQuickMenuIsActive";
import { useTranslatorStatus } from "../useTranslatorStatus/useTranslatorStatus";

interface FeatureStatus {
  isEnabled: boolean;
  toggle: (checked: boolean) => Promise<void>;
}

interface UseFeaturesStatus {
  translator: FeatureStatus;
  quickMessages: FeatureStatus;
  quickMenu: FeatureStatus;
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

  const [isTranslatorEnabled, setIsTranslatorEnabled] = useState(false);
  const [isQuickMessagesEnabled, setIsQuickMessagesEnabled] = useState(false);
  const [isQuickMenuEnabled, setIsQuickMenuEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initFeaturesState = useCallback(async () => {
    if (isInitialized) return;

    const [translator, quickMessages, quickMenu] = await Promise.all([
      translatorStatus.getItem(),
      quickMessagesStatus.getItem(),
      quickMenuIsActive.getItem(),
    ]);

    setIsTranslatorEnabled(translator);
    setIsQuickMessagesEnabled(quickMessages);
    setIsQuickMenuEnabled(quickMenu);
    setIsInitialized(true);
  }, [isInitialized, translatorStatus, quickMessagesStatus, quickMenuIsActive]);

  useEffect(() => {
    initFeaturesState();

    translatorStatus.watchItem((value) => setIsTranslatorEnabled(value));
    quickMessagesStatus.watchItem((value) => setIsQuickMessagesEnabled(value));
    quickMenuIsActive.watchItem((value) => setIsQuickMenuEnabled(value));
  }, [
    initFeaturesState,
    translatorStatus,
    quickMessagesStatus,
    quickMenuIsActive,
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
    isInitialized,
  };
};
