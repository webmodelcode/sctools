import { beforeEach, describe, expect, it, vi } from "vitest";

import { scAdapter } from "../sc.adapter";
import { render } from "@testing-library/react";

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
  it("should return true whel all SCElements are ready", async () => {
    const elm = document.createElement("div");
    scAdapter.getScElementByClassName = vi.fn().mockResolvedValue(elm);
    scAdapter.getScElementById = vi.fn().mockResolvedValue(elm);

    const broadcastContainer = scAdapter.getScElementByClassName("asasa");
    console.log(broadcastContainer);

    expect(scAdapter.isScElementsReady()).toBeTruthy();
  });
});
