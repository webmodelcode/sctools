import { beforeEach, describe, expect, it, vi } from "vitest";

import { scAdapter } from "../sc.adapter";
import { render } from "@testing-library/react";
import { SC_STRINGS } from "../sc.strings";

const elmClassName = "class-test";
const elmId = "id-test";
const MockScWeb = () => {
  return <div className={elmClassName} id={elmId} />;
};

const MockScErrorWeb = () => {
  return <div />;
};

describe("sc.adapter by Classes", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("should return element by Class", () => {
    render(<MockScWeb />);

    const broadcastContainer = scAdapter.getScElementByClassName(elmClassName);
    expect(broadcastContainer).toHaveClass(elmClassName);
  });

  it("should return null ", () => {
    render(<MockScErrorWeb />);

    const broadcastContainer = scAdapter.getScElementByClassName(elmClassName);
    expect(broadcastContainer).toBeNull();
  });

  it("should return error ", () => {
    vi.spyOn(document, "getElementsByClassName").mockImplementation(() => {
      throw new Error();
    });
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    scAdapter.getScElementByClassName(elmClassName);
    expect(consoleWarn).toBeCalled();
  });
});

describe("sc.adapter by Id", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("should return element by ID", () => {
    render(<MockScWeb />);

    const broadcastContainer = scAdapter.getScElementById(elmId);
    expect(broadcastContainer).not.toBeUndefined();
    expect(broadcastContainer).not.toBeNull();
  });

  it("should return null ", () => {
    render(<MockScErrorWeb />);

    const broadcastContainer = scAdapter.getScElementById(elmId);
    expect(broadcastContainer).toBeNull();
  });

  it("should return error ", () => {
    vi.spyOn(document, "getElementById").mockImplementation(() => {
      throw new Error();
    });
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    scAdapter.getScElementById(elmId);
    expect(consoleWarn).toBeCalled();
  });
});

describe("sc.adapter SCElements are ready", () => {
  vi.mock("./sc.strings", () => ({
    SC_STRINGS: {
      SC_CLASSES: ["class1", "class2"],
      SC_IDS: ["id1", "id2"],
    },
  }));
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });
  it("should return true whel all SCElements are ready", async () => {
    SC_STRINGS.SC_CLASSES.forEach((className) => {
      const element = document.createElement("div");
      element.className = className;
      document.body.appendChild(element);
    });

    SC_STRINGS.SC_IDS.forEach((id) => {
      const element = document.createElement("div");
      element.id = id;
      document.body.appendChild(element);
    });

    expect(scAdapter.isScElementsReady()).toBe(true);
  });

  it("should return false when some class elements are missing", () => {
    // only add id elements
    SC_STRINGS.SC_IDS.forEach((id) => {
      const element = document.createElement("div");
      element.id = id;
      document.body.appendChild(element);
    });

    expect(scAdapter.isScElementsReady()).toBe(false);
  });

  it("should return false when some id elements are missing", () => {
    // only add classes elements
    SC_STRINGS.SC_CLASSES.forEach((className) => {
      const element = document.createElement("div");
      element.className = className;
      document.body.appendChild(element);
    });

    expect(scAdapter.isScElementsReady()).toBe(false);
  });

  it("should return false when no elements exist", () => {
    expect(scAdapter.isScElementsReady()).toBe(false);
  });

  it("should handle errors when checking elements", () => {
    // Simulate an error when searching for items
    const consoleSpy = vi.spyOn(console, "warn");
    const mockDocument = {
      getElementsByClassName: () => {
        throw new Error("Test error");
      },
      getElementById: () => {
        throw new Error("Test error");
      },
    };

    // Temporarily replace document with our mock
    const originalDocument = global.document;
    global.document = mockDocument as unknown as Document;

    expect(scAdapter.isScElementsReady()).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    // Reset Original document
    global.document = originalDocument;
    consoleSpy.mockRestore();
  });
});
