import { render, fireEvent, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MaximizeButton } from "../MaximizeButton";
import { SC_STRINGS } from "@/config/scAdapter/sc.strings";
import { GLOBAL_STINGS, scAdapter } from "@/config/";

// Mocks
vi.mock("@/config/", () => ({
  scAdapter: {
    isScElementsReady: vi.fn(),
    getScElementByClassName: vi.fn(),
    getScElementById: vi.fn(),
  },
  GLOBAL_STINGS: {
    SC_ELEMENTS_NO_READY: "Elements are not ready",
  },
}));

const mockAlert = vi.fn();
window.alert = mockAlert;

describe("MaximizeButton.tsx", () => {
  let mockElements = {
    scBroadcastContainer: document.createElement("div"),
    scBroadCastWrapper: document.createElement("div"),
    scBroadcastSwitch: document.createElement("div"),
    scMemberList: document.createElement("div"),
  };

  beforeEach(() => {
    document.body.innerHTML = "";
    mockElements = {
      scBroadcastContainer: document.createElement("div"),
      scBroadCastWrapper: document.createElement("div"),
      scBroadcastSwitch: document.createElement("div"),
      scMemberList: document.createElement("div"),
    };
    vi.clearAllMocks();

    vi.mocked(scAdapter.getScElementByClassName).mockImplementation(
      (className) => {
        switch (className) {
          case SC_STRINGS.BROADCAST_CONTAINER.CLASS:
            return mockElements.scBroadcastContainer;
          case SC_STRINGS.BROADCAST_WRAPPER.CLASS:
            return mockElements.scBroadCastWrapper;
          case SC_STRINGS.MEMBER_LIST.CLASS:
            return mockElements.scMemberList;
          default:
            return null;
        }
      }
    );

    vi.mocked(scAdapter.getScElementById).mockImplementation((id) => {
      if (id === SC_STRINGS.BROADCAST_SWITCH.ID) {
        return mockElements.scBroadcastSwitch;
      }
      return null;
    });
  });

  it("should render the maximize button", () => {
    render(<MaximizeButton />);

    const button = screen.getByRole("menuButton");
    expect(button).toBeInstanceOf(HTMLElement);
  });

  it("should show alert when SC elements are not ready", () => {
    // Simular elementos no listos
    vi.mocked(scAdapter.isScElementsReady).mockReturnValue(false);

    render(<MaximizeButton />);
    const button = screen.getByRole("menuButton");

    act(() => {
      fireEvent.click(button);
    });

    expect(mockAlert).toHaveBeenCalledWith(GLOBAL_STINGS.SC_ELEMENTS_NO_READY);
  });

  it("should maximize the view when clicked first time", () => {
    // Simulate ready elements
    vi.mocked(scAdapter.isScElementsReady).mockReturnValue(true);

    render(<MaximizeButton />);
    const button = screen.getByRole("menuButton");

    act(() => {
      fireEvent.click(button);
    });

    // Verify that the correct classes are added
    expect(
      mockElements.scBroadcastContainer.classList.contains("sct-flex-reverse")
    ).toBe(true);
    expect(
      mockElements.scBroadCastWrapper.classList.contains("sct-dnone")
    ).toBe(true);
    expect(mockElements.scBroadcastSwitch.classList.contains("sct-dnone")).toBe(
      true
    );
    expect(mockElements.scMemberList.classList.contains("sct-h-70")).toBe(true);
  });

  it("should restore the view when clicked second time", () => {
    // Simulate ready elements
    vi.mocked(scAdapter.isScElementsReady).mockReturnValue(true);

    render(<MaximizeButton />);
    const button = screen.getByRole("menuButton");

    act(() => {
      fireEvent.click(button);
    });

    // Verify that classes are removed

    expect(
      mockElements.scBroadcastContainer.classList.contains("sct-flex-reverse")
    ).toBe(true);
    expect(
      mockElements.scBroadCastWrapper.classList.contains("sct-dnone")
    ).toBe(true);
    expect(mockElements.scBroadcastSwitch.classList.contains("sct-dnone")).toBe(
      true
    );
    expect(mockElements.scMemberList.classList.contains("sct-h-70")).toBe(true);

    act(() => {
      fireEvent.click(button);
    });
    expect(
      mockElements.scBroadcastContainer.classList.contains("sct-flex-reverse")
    ).toBe(false);
    expect(
      mockElements.scBroadCastWrapper.classList.contains("sct-dnone")
    ).toBe(false);
    expect(mockElements.scBroadcastSwitch.classList.contains("sct-dnone")).toBe(
      false
    );
    expect(mockElements.scMemberList.classList.contains("sct-h-70")).toBe(
      false
    );
  });
});
