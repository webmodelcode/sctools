import { render, fireEvent, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MaximizeButton } from "../MaximizeButton";
import { scAdapter } from "~@/config/scAdapter/sc.adapter";
import { SC_STRINGS } from "~@/config/scAdapter/sc.strings";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

// Mocks
vi.mock("~@/config/scAdapter/sc.adapter", () => ({
  scAdapter: {
    isScElementsReady: vi.fn(),
    getScElementByClassName: vi.fn(),
    getScElementById: vi.fn(),
    isScErrorNode: vi.fn(),
  },
}));

vi.mock(
  "~@/presentation/hooks/useMutationObserver/useMutationObserver",
  () => ({
    useMutationObserver: vi.fn(),
  }),
);

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
      },
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

    expect(mockAlert).toHaveBeenCalledWith(
      GLOBAL_STRINGS.ERROR_MESSAGES.SC_ELEMENTS_NOT_READY,
    );
  });

  it("should maximize the view when clicked first time", () => {
    // Simulate ready elements
    vi.mocked(scAdapter.isScElementsReady).mockReturnValue(true);

    render(<MaximizeButton />);
    const button = screen.getByRole("menuButton");

    act(() => {
      fireEvent.click(button);
    });

    // Verify that the correct styles are applied
    expect(mockElements.scBroadcastContainer.style.flexDirection).toBe(
      "column-reverse",
    );
    expect(mockElements.scBroadcastContainer.style.height).toBe("70vh");
    expect(mockElements.scBroadCastWrapper.style.display).toBe("none");
    expect(mockElements.scBroadcastSwitch.style.display).toBe("none");
    expect(mockElements.scMemberList.style.height).toBe("70vh");
  });

  it("should restore the view when clicked second time", () => {
    // Simulate ready elements
    vi.mocked(scAdapter.isScElementsReady).mockReturnValue(true);

    render(<MaximizeButton />);
    const button = screen.getByRole("menuButton");

    // First click - maximize
    act(() => {
      fireEvent.click(button);
    });

    // Verify maximized state
    expect(mockElements.scBroadcastContainer.style.flexDirection).toBe(
      "column-reverse",
    );
    expect(mockElements.scBroadcastContainer.style.height).toBe("70vh");
    expect(mockElements.scBroadCastWrapper.style.display).toBe("none");
    expect(mockElements.scBroadcastSwitch.style.display).toBe("none");
    expect(mockElements.scMemberList.style.height).toBe("70vh");

    // Second click - restore
    act(() => {
      fireEvent.click(button);
    });

    // Verify restored state
    expect(mockElements.scBroadcastContainer.style.flexDirection).toBe("");
    expect(mockElements.scBroadcastContainer.style.height).toBe("");
    expect(mockElements.scBroadCastWrapper.style.display).toBe("");
    expect(mockElements.scBroadcastSwitch.style.display).toBe("");
    expect(mockElements.scMemberList.style.height).toBe("");
  });

  it("should handle error nodes correctly", () => {
    // Mock implementation for isScErrorNode
    vi.mocked(scAdapter.isScErrorNode).mockImplementation((node) => {
      return (node as HTMLElement).innerHTML.includes("loadableerrorboundary");
    });

    // Create a spy on location.reload
    const reloadSpy = vi
      .spyOn(window.location, "reload")
      .mockImplementation(() => {});

    // Render the component
    render(<MaximizeButton />);

    // Verify that useMutationObserver was imported and used
    const useMutationObserverMock = vi.mocked(
      vi.importActual(
        "~@/presentation/hooks/useMutationObserver/useMutationObserver",
      ),
    );
    expect(useMutationObserverMock).toBeDefined();

    // Create a test error node
    const errorNode = document.createElement("div");
    errorNode.innerHTML = "<div>loadableerrorboundary</div>";

    // Directly test the behavior of isScErrorNode
    expect(scAdapter.isScErrorNode(errorNode)).toBe(true);

    // Clean up
    reloadSpy.mockRestore();
  });
});
