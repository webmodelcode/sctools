import { describe, it, expect, vi } from "vitest";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  it("should use chrome.storage.local.set to save data", async () => {
    const { setItem } = useLocalStorage();
    vi.spyOn(chrome.storage.local, "set").mockResolvedValue(undefined);
    setItem("testKey", "testValue");

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      testKey: "testValue",
    });
  });
});
