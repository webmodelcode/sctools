import { describe, it, expect, vi, beforeEach } from "vitest";

describe("webSpeechRecognition.local.datasource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Remove any window-level SpeechRecognition mocks between tests
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });

  it("should export localSpeechRecognition object with required methods", async () => {
    const module = await import("../webSpeechRecognition.local.datasource");

    expect(module).toHaveProperty("localSpeechRecognition");
    expect(typeof module.localSpeechRecognition.isAvailable).toBe("function");
    expect(typeof module.localSpeechRecognition.create).toBe("function");
  });

  it("should return false from isAvailable when SpeechRecognition is not in window", async () => {
    const { localSpeechRecognition } = await import(
      "../webSpeechRecognition.local.datasource"
    );

    expect(localSpeechRecognition.isAvailable()).toBe(false);
  });

  it("should return true from isAvailable when SpeechRecognition is present", async () => {
    (window as any).SpeechRecognition = vi.fn();

    const { localSpeechRecognition } = await import(
      "../webSpeechRecognition.local.datasource"
    );

    expect(localSpeechRecognition.isAvailable()).toBe(true);
  });

  it("should return true from isAvailable when webkitSpeechRecognition is present", async () => {
    (window as any).webkitSpeechRecognition = vi.fn();

    const { localSpeechRecognition } = await import(
      "../webSpeechRecognition.local.datasource"
    );

    expect(localSpeechRecognition.isAvailable()).toBe(true);
  });

  it("should create a recognition instance with correct configuration", async () => {
    const mockRecognition = {
      lang: "",
      continuous: false,
      interimResults: false,
      onspeechstart: null,
      onresult: null,
      onend: null,
      onerror: null,
      start: vi.fn(),
      stop: vi.fn(),
    };
    // Must use a regular function (not arrow) to be constructable with `new`
    (window as any).SpeechRecognition = function MockSpeechRecognition() {
      return mockRecognition;
    };

    const { localSpeechRecognition } = await import(
      "../webSpeechRecognition.local.datasource"
    );

    const config = {
      lang: "es",
      onSpeechStart: vi.fn(),
      onResult: vi.fn(),
      onEnd: vi.fn(),
      onError: vi.fn(),
    };

    localSpeechRecognition.create(config);

    expect(mockRecognition.lang).toBe("es");
    expect(mockRecognition.continuous).toBe(true);
    expect(mockRecognition.interimResults).toBe(true);
    expect(mockRecognition.onspeechstart).toBe(config.onSpeechStart);
    expect(typeof mockRecognition.onresult).toBe("function");
    expect(mockRecognition.onend).toBe(config.onEnd);
    expect(mockRecognition.onerror).toBe(config.onError);
  });

  it("should call onResult with transcript and isFinal for each recognition result", async () => {
    const mockRecognition = {
      lang: "",
      continuous: false,
      interimResults: false,
      onresult: null as ((event: any) => void) | null,
      onend: null,
      onerror: null,
    };
    (window as any).SpeechRecognition = function MockSpeechRecognition() {
      return mockRecognition;
    };

    const { localSpeechRecognition } = await import(
      "../webSpeechRecognition.local.datasource"
    );

    const onResult = vi.fn();
    localSpeechRecognition.create({ lang: "es", onSpeechStart: vi.fn(), onResult, onEnd: vi.fn(), onError: vi.fn() });

    const mockEvent = {
      resultIndex: 0,
      results: [
        Object.assign([{ transcript: "hola mundo" }], { isFinal: false }),
      ],
    };

    mockRecognition.onresult!(mockEvent);

    expect(onResult).toHaveBeenCalledWith("hola mundo", false);
  });

  it("should use webkitSpeechRecognition as fallback when SpeechRecognition is absent", async () => {
    const mockRecognition = {
      lang: "",
      continuous: false,
      interimResults: false,
      onresult: null,
      onend: null,
      onerror: null,
    };
    let webkitCalled = false;
    (window as any).webkitSpeechRecognition = function MockWebkit() {
      webkitCalled = true;
      return mockRecognition;
    };

    const { localSpeechRecognition } = await import(
      "../webSpeechRecognition.local.datasource"
    );

    localSpeechRecognition.create({ lang: "es", onSpeechStart: vi.fn(), onResult: vi.fn(), onEnd: vi.fn(), onError: vi.fn() });

    expect(webkitCalled).toBe(true);
  });
});
