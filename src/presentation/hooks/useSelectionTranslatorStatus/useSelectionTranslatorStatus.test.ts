import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSelectionTranslatorStatus } from "./useSelectionTranslatorStatus";

const browser = (globalThis as any).browser;

vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    STORAGE_KEYS: {
      SELECTION_TRANSLATOR_IS_ACTIVE: "selection_translator_is_active",
    },
  },
}));

describe("useSelectionTranslatorStatus Hook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await browser.storage.local.clear();
  });

  it("should get item value (default true)", async () => {
    const { result } = renderHook(() => useSelectionTranslatorStatus());
    expect(await result.current.getItem()).toBe(true);

    await browser.storage.local.set({ selection_translator_is_active: false });
    expect(await result.current.getItem()).toBe(false);
  });

  it("should set item value", async () => {
    const { result } = renderHook(() => useSelectionTranslatorStatus());

    await result.current.setItem(false);

    const value = await result.current.getItem();
    expect(value).toBe(false);

    const storageData = await browser.storage.local.get(null);
    expect(storageData["selection_translator_is_active"]).toBe(false);
  });

  it("should watch item changes", async () => {
    const { result } = renderHook(() => useSelectionTranslatorStatus());
    const callback = vi.fn();

    await result.current.watchItem(callback);

    await browser.storage.local.set({ selection_translator_is_active: true });
    expect(callback).toHaveBeenCalledWith(true);

    await browser.storage.local.set({ selection_translator_is_active: false });
    expect(callback).toHaveBeenCalledWith(false);
  });
});
