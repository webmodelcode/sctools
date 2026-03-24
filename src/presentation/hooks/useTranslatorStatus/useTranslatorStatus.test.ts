import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useTranslatorStatus } from "./useTranslatorStatus";

const browser = (globalThis as any).browser;

// Retain mock for GLOBAL_STRINGS to ensure consistent keys
vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    STORAGE_KEYS: {
      TRANSLATOR_IS_ACTIVE: "translator_is_active",
    },
  },
}));

describe("useTranslatorStatus Hook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await browser.storage.local.clear();
  });

  it("should get item value", async () => {
    // Test default fallback (false)
    const { result } = renderHook(() => useTranslatorStatus());
    expect(await result.current.getItem()).toBe(true);

    // Set via browser storage
    await browser.storage.local.set({ translator_is_active: true });
    expect(await result.current.getItem()).toBe(true);
  });

  it("should set item value", async () => {
    const { result } = renderHook(() => useTranslatorStatus());

    await result.current.setItem(true);

    const value = await result.current.getItem();
    expect(value).toBe(true);

    // Verify it persists in storage (integration check)
    const storageData = await browser.storage.local.get(null);
    expect(storageData["translator_is_active"]).toBe(true);
  });

  it("should watch item changes", async () => {
    const { result } = renderHook(() => useTranslatorStatus());
    const callback = vi.fn();

    await result.current.watchItem(callback);

    // Trigger change via storage
    await browser.storage.local.set({ translator_is_active: true });

    expect(callback).toHaveBeenCalledWith(true);

    await browser.storage.local.set({ translator_is_active: false });
    expect(callback).toHaveBeenCalledWith(false);
  });
});
