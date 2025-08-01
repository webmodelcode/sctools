/**
 * useExtensionState Hook
 *
 * Custom hook that manages the extension state logic.
 *
 * @module hooks/useExtensionState
 * @returns {object} - Returns the extension state and handlers.
 */

import { useCallback, useEffect, useState } from "react";
import { useQuickMenuIsActive } from "../useQuickMenuIsActive/useQuickMenuIsActive";

export const useExtensionState = () => {
  const quickMenuIsActive = useQuickMenuIsActive();
  const [isQuickMenuEnabled, setIsQuickMenuEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initExtensionState = useCallback(async () => {
    if (isInitialized) return;

    const storedState = await quickMenuIsActive.getItem();
    setIsQuickMenuEnabled(storedState);
    setIsInitialized(true);
  }, [isInitialized, quickMenuIsActive]);

  useEffect(() => {
    initExtensionState();
  }, [initExtensionState]);

  const handleToggleExtension = useCallback(
    async (checked: boolean) => {
      quickMenuIsActive.setItem(checked);
      setIsQuickMenuEnabled(checked);
    },
    [quickMenuIsActive]
  );

  return {
    isQuickMenuEnabled,
    isInitialized,
    handleToggleExtension,
  };
};