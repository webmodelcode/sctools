import { beforeEach, describe, expect, it, vi } from "vitest";

import { scAdapter } from "../sc.adapter";
import { render } from "@testing-library/react";
import { SC_STRINGS } from "../sc.strings";
import { ScClasses } from "../sc.interfaces";

const elmClassName: ScClasses = "messages";
const elmId = "id-test";
const validScClass: ScClasses = "BroadcastContainer__main#ka";
const MockScWeb = () => {
  return <div className={elmClassName} id={elmId} />;
};

const MockScErrorWeb = () => {
  return <div />;
};

const MockErrorNode = () => {
  return <div>loadableerrorboundary error content</div>;
};

const MockNormalNode = () => {
  return <div>normal content</div>;
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

describe("sc.adapter by Multiple Classes", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("should return multiple elements by Class", () => {
    // Create multiple elements with the same class
    const div1 = document.createElement("div");
    div1.className = elmClassName;
    const div2 = document.createElement("div");
    div2.className = elmClassName;
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    const elements = scAdapter.getScMultipleElementsByClassName(elmClassName);
    expect(elements).toHaveLength(2);
    expect(elements[0]).toHaveClass(elmClassName);
    expect(elements[1]).toHaveClass(elmClassName);
  });

  it("should return empty collection when no elements found", () => {
    render(<MockScErrorWeb />);

    const elements = scAdapter.getScMultipleElementsByClassName(validScClass);
    expect(elements).toHaveLength(0);
  });

  it("should handle errors and return empty array", () => {
    vi.spyOn(document, "getElementsByClassName").mockImplementation(() => {
      throw new Error("Test error");
    });
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    const elements = scAdapter.getScMultipleElementsByClassName(elmClassName);
    expect(elements).toEqual([]);
    expect(consoleWarn).toHaveBeenCalled();
  });
});

describe("sc.adapter Error Node Detection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("should detect error node with loadableerrorboundary content", () => {
    const { container } = render(<MockErrorNode />);
    const errorNode = container.firstChild as Node;
    
    expect(scAdapter.isScErrorNode(errorNode)).toBe(true);
  });

  it("should not detect normal node as error", () => {
    const { container } = render(<MockNormalNode />);
    const normalNode = container.firstChild as Node;
    
    expect(scAdapter.isScErrorNode(normalNode)).toBe(false);
  });

  it("should handle case insensitive error detection", () => {
    const div = document.createElement("div");
    div.innerHTML = "LOADABLEERRORBOUNDARY";
    
    expect(scAdapter.isScErrorNode(div)).toBe(true);
  });

  it("should handle errors and return false", () => {
    const mockNode = {
      innerHTML: undefined,
    } as unknown as Node;
    
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    expect(scAdapter.isScErrorNode(mockNode)).toBe(false);
    expect(consoleWarn).toHaveBeenCalled();
  });
});

describe("sc.adapter SCElements are ready", () => {
  vi.mock("../sc.strings", () => ({
    SC_STRINGS: {
      SC_CLASSES: ["class1", "class2"],
      SC_IDS: ["id1", "id2"],
    },
  }));
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });
  it("should return true when all SCElements are ready", async () => {
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
