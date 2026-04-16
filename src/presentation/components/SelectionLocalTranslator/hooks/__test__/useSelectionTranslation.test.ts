import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSelectionTranslation } from "../useSelectionTranslation";

vi.mock("~@/config/utils/globalStrings", () => ({
  GLOBAL_STRINGS: {
    BG_MESSAGE_TYPE: {
      SELECTION_MESSAGE: "SELECTION_MESSAGE",
    },
  },
}));

const mockSendMessage = vi.fn();

describe("useSelectionTranslation", () => {
  beforeEach(() => {
    mockSendMessage.mockReset();
    vi.spyOn((globalThis as any).browser.runtime, "sendMessage").mockImplementation(mockSendMessage);
  });

  it("should start in idle state", () => {
    const { result } = renderHook(() => useSelectionTranslation());

    expect(result.current.status).toBe("idle");
    expect(result.current.translatedText).toBeNull();
    expect(result.current.sourceLanguage).toBeNull();
    expect(result.current.errorMessage).toBeUndefined();
  });

  it("idle → translating → done on successful translation", async () => {
    const successResponse = {
      translatedText: "Hola mundo",
      sourceLanguage: "en",
    };

    mockSendMessage.mockImplementation((_msg: unknown, callback: (r: typeof successResponse) => void) => {
      callback(successResponse);
    });

    const { result } = renderHook(() => useSelectionTranslation());

    await act(async () => {
      await result.current.translate("Hello world", "es");
    });

    expect(result.current.status).toBe("done");
    expect(result.current.translatedText).toBe("Hola mundo");
    expect(result.current.sourceLanguage).toBe("en");
    expect(result.current.errorMessage).toBeUndefined();
  });

  it("idle → translating → error when response is undefined", async () => {
    mockSendMessage.mockImplementation((_msg: unknown, callback: (r: undefined) => void) => {
      callback(undefined);
    });

    const { result } = renderHook(() => useSelectionTranslation());

    await act(async () => {
      await result.current.translate("Hello world", "es");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.translatedText).toBeNull();
    expect(result.current.sourceLanguage).toBeNull();
    expect(result.current.errorMessage).toBe("Translation unavailable");
  });

  it("should send correct message to background", async () => {
    mockSendMessage.mockImplementation((_msg: unknown, callback: (r: undefined) => void) => {
      callback(undefined);
    });

    const { result } = renderHook(() => useSelectionTranslation());

    await act(async () => {
      await result.current.translate("test text", "fr");
    });

    expect(mockSendMessage).toHaveBeenCalledWith(
      {
        type: "SELECTION_MESSAGE",
        data: "test text",
        target: "fr",
      },
      expect.any(Function),
    );
  });

  it("reset returns to idle state", async () => {
    const successResponse = {
      translatedText: "Hola",
      sourceLanguage: "en",
    };

    mockSendMessage.mockImplementation((_msg: unknown, callback: (r: typeof successResponse) => void) => {
      callback(successResponse);
    });

    const { result } = renderHook(() => useSelectionTranslation());

    await act(async () => {
      await result.current.translate("Hello", "es");
    });

    expect(result.current.status).toBe("done");

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.translatedText).toBeNull();
    expect(result.current.sourceLanguage).toBeNull();
    expect(result.current.errorMessage).toBeUndefined();
  });

  it("sets status to translating before receiving response", async () => {
    let capturedStatus = "";
    let resolveCallback: ((r: { translatedText: string; sourceLanguage: string }) => void) | null = null;

    mockSendMessage.mockImplementation((_msg: unknown, callback: (r: { translatedText: string; sourceLanguage: string }) => void) => {
      resolveCallback = callback;
    });

    const { result } = renderHook(() => useSelectionTranslation());

    act(() => {
      result.current.translate("Hello", "es");
    });

    capturedStatus = result.current.status;
    expect(capturedStatus).toBe("translating");

    await act(async () => {
      resolveCallback!({ translatedText: "Hola", sourceLanguage: "en" });
    });

    expect(result.current.status).toBe("done");
  });
});
