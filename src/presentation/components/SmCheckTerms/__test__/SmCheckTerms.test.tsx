import { describe, it, beforeEach, vi, afterEach, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { SmCheckTerms } from "../SmCheckTerms";
import { smAdapter } from "~@/config/smAdapter/sm.adapter";

describe("SmCheckTerms", () => {
  let originalAlert: typeof window.alert;

  beforeEach(() => {
    originalAlert = window.alert;
    window.alert = vi.fn();
  });

  afterEach(() => {
    window.alert = originalAlert;
    vi.restoreAllMocks();
  });

  it("should_trigger_consent_check_when_elements_present", () => {
    const consentModal = document.createElement("div");
    const checkbox1 = document.createElement("input");
    const checkbox2 = document.createElement("input");
    const consentButton = document.createElement("button");

    vi.spyOn(smAdapter, "getConsentModal").mockReturnValue(consentModal);
    vi.spyOn(smAdapter, "getConsentCheckbox").mockReturnValue([
      checkbox1,
      checkbox2,
    ] as unknown as NodeListOf<Element>);
    vi.spyOn(smAdapter, "getConsentButton").mockReturnValue(consentButton);

    const checkbox1Click = vi.spyOn(checkbox1, "click");
    const checkbox2Click = vi.spyOn(checkbox2, "click");
    const buttonClick = vi.spyOn(consentButton, "click");

    render(<SmCheckTerms />);
    const menuButton = screen.getByRole("menuButton");
    fireEvent.click(menuButton);

    expect(smAdapter.getConsentModal).toHaveBeenCalled();
    expect(smAdapter.getConsentCheckbox).toHaveBeenCalled();
    expect(smAdapter.getConsentButton).toHaveBeenCalled();
    expect(checkbox1Click).toHaveBeenCalled();
    expect(checkbox2Click).toHaveBeenCalled();
    expect(buttonClick).toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("should_click_all_consent_checkboxes_when_present", () => {
    const consentModal = document.createElement("div");
    const checkbox1 = document.createElement("input");
    const checkbox2 = document.createElement("input");
    const consentButton = document.createElement("button");

    vi.spyOn(smAdapter, "getConsentModal").mockReturnValue(consentModal);
    vi.spyOn(smAdapter, "getConsentCheckbox").mockReturnValue([
      checkbox1,
      checkbox2,
    ] as unknown as NodeListOf<Element>);
    vi.spyOn(smAdapter, "getConsentButton").mockReturnValue(consentButton);

    const checkbox1Click = vi.spyOn(checkbox1, "click");
    const checkbox2Click = vi.spyOn(checkbox2, "click");

    render(<SmCheckTerms />);
    const menuButton = screen.getByRole("menuButton");
    fireEvent.click(menuButton);

    expect(checkbox1Click).toHaveBeenCalledTimes(1);
    expect(checkbox2Click).toHaveBeenCalledTimes(1);
  });

  it("should_click_consent_button_after_checking_checkboxes", () => {
    const consentModal = document.createElement("div");
    const checkbox = document.createElement("input");
    const consentButton = document.createElement("button");

    vi.spyOn(smAdapter, "getConsentModal").mockReturnValue(consentModal);
    vi.spyOn(smAdapter, "getConsentCheckbox").mockReturnValue([
      checkbox,
    ] as unknown as NodeListOf<Element>);
    vi.spyOn(smAdapter, "getConsentButton").mockReturnValue(consentButton);

    const buttonClick = vi.spyOn(consentButton, "click");

    render(<SmCheckTerms />);
    const menuButton = screen.getByRole("menuButton");
    fireEvent.click(menuButton);

    expect(buttonClick).toHaveBeenCalledTimes(1);
  });

  it("should_alert_when_consent_modal_is_missing", () => {
    vi.spyOn(smAdapter, "getConsentModal").mockReturnValue(null);

    render(<SmCheckTerms />);
    const menuButton = screen.getByRole("menuButton");
    fireEvent.click(menuButton);

    expect(window.alert).toHaveBeenCalledWith(
      "This button is only to accept the consent when starting stream ",
    );
  });

  it("should_alert_when_consent_checkboxes_are_missing", () => {
    const consentModal = document.createElement("div");
    vi.spyOn(smAdapter, "getConsentModal").mockReturnValue(consentModal);
    vi.spyOn(smAdapter, "getConsentCheckbox").mockReturnValue(undefined);

    render(<SmCheckTerms />);
    const menuButton = screen.getByRole("menuButton");
    fireEvent.click(menuButton);

    expect(window.alert).toHaveBeenCalledWith(
      "This button is only to accept the consent when starting stream ",
    );
  });

  it("should_return_false_when_consent_button_is_missing", () => {
    const consentModal = document.createElement("div");
    const checkbox = document.createElement("input");

    vi.spyOn(smAdapter, "getConsentModal").mockReturnValue(consentModal);
    vi.spyOn(smAdapter, "getConsentCheckbox").mockReturnValue([
      checkbox,
    ] as unknown as NodeListOf<Element>);
    vi.spyOn(smAdapter, "getConsentButton").mockReturnValue(undefined);

    const checkboxClick = vi.spyOn(checkbox, "click");

    render(<SmCheckTerms />);
    const menuButton = screen.getByRole("menuButton");
    fireEvent.click(menuButton);

    expect(checkboxClick).toHaveBeenCalledTimes(1);
    expect(window.alert).not.toHaveBeenCalled();
  });
});
