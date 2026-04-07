import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSpeechToTranslateTabId } from "./useSpeechToTranslateTabId";

const browser = (globalThis as any).browser;

vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    STORAGE_KEYS: {
      SPEECH_TO_TRANSLATE_TAB_ID: "speech_to_translate_tab_id",
    },
  },
}));

describe("useSpeechToTranslateTabId Hook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await browser.storage.local.clear();
  });

  it("should return the fallback value (null) when storage is empty", async () => {
    const { result } = renderHook(() => useSpeechToTranslateTabId());
    expect(await result.current.getItem()).toBeNull();
  });

  it("should set and get a tab ID", async () => {
    const { result } = renderHook(() => useSpeechToTranslateTabId());

    await result.current.setItem(42);
    expect(await result.current.getItem()).toBe(42);

    const storageData = await browser.storage.local.get(null);
    expect(storageData["speech_to_translate_tab_id"]).toBe(42);
  });

  it("should set tab ID back to null", async () => {
    const { result } = renderHook(() => useSpeechToTranslateTabId());

    await result.current.setItem(42);
    await result.current.setItem(null);
    expect(await result.current.getItem()).toBeNull();
  });

  it("should watch item changes", async () => {
    const { result } = renderHook(() => useSpeechToTranslateTabId());
    const callback = vi.fn();

    result.current.watchItem(callback);

    await browser.storage.local.set({ speech_to_translate_tab_id: 99 });
    expect(callback).toHaveBeenCalledWith(99);

    await browser.storage.local.set({ speech_to_translate_tab_id: null });
    expect(callback).toHaveBeenCalledWith(null);
  });
});
