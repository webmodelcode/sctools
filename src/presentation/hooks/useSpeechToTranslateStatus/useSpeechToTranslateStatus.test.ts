import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSpeechToTranslateStatus } from "./useSpeechToTranslateStatus";

const browser = (globalThis as any).browser;

vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    STORAGE_KEYS: {
      SPEECH_TO_TRANSLATE_IS_ACTIVE: "speech_to_translate_is_active",
    },
  },
}));

describe("useSpeechToTranslateStatus Hook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await browser.storage.local.clear();
  });

  it("should return the fallback value (false) when storage is empty", async () => {
    const { result } = renderHook(() => useSpeechToTranslateStatus());
    expect(await result.current.getItem()).toBe(false);
  });

  it("should set and get item value", async () => {
    const { result } = renderHook(() => useSpeechToTranslateStatus());

    await result.current.setItem(true);
    expect(await result.current.getItem()).toBe(true);

    const storageData = await browser.storage.local.get(null);
    expect(storageData["speech_to_translate_is_active"]).toBe(true);
  });

  it("should watch item changes", async () => {
    const { result } = renderHook(() => useSpeechToTranslateStatus());
    const callback = vi.fn();

    result.current.watchItem(callback);

    await browser.storage.local.set({ speech_to_translate_is_active: true });
    expect(callback).toHaveBeenCalledWith(true);

    await browser.storage.local.set({ speech_to_translate_is_active: false });
    expect(callback).toHaveBeenCalledWith(false);
  });
});
