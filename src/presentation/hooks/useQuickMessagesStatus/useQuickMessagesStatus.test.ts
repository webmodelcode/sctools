import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useQuickMessagesStatus } from "./useQuickMessagesStatus";

const browser = (globalThis as any).browser;

vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    STORAGE_KEYS: {
      QUICK_MESSAGES_IS_ACTIVE: "quick_messages_is_active",
    },
  },
}));

describe("useQuickMessagesStatus Hook", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await browser.storage.local.clear();
  });

  it("should get item value", async () => {
    const { result } = renderHook(() => useQuickMessagesStatus());
    expect(await result.current.getItem()).toBe(true);

    await browser.storage.local.set({ quick_messages_is_active: true });
    expect(await result.current.getItem()).toBe(true);
  });

  it("should set item value", async () => {
    const { result } = renderHook(() => useQuickMessagesStatus());

    await result.current.setItem(true);

    const value = await result.current.getItem();
    expect(value).toBe(true);

    const storageData = await browser.storage.local.get(null);
    expect(storageData["quick_messages_is_active"]).toBe(true);
  });

  it("should watch item changes", async () => {
    const { result } = renderHook(() => useQuickMessagesStatus());
    const callback = vi.fn();

    await result.current.watchItem(callback);

    await browser.storage.local.set({ quick_messages_is_active: true });
    expect(callback).toHaveBeenCalledWith(true);

    await browser.storage.local.set({ quick_messages_is_active: false });
    expect(callback).toHaveBeenCalledWith(false);
  });
});
