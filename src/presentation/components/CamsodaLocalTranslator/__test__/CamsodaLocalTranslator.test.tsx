import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { CamsodaLocalTranslator } from "../CamsodaLocalTranslator";
import { useCamsodaMessages } from "../hooks/useCamsodaMessages";

vi.mock("../hooks/useCamsodaMessages");

describe("CamsodaLocalTranslator", () => {
  it("renders messages correctly", () => {
    const mockMessages = [
      {
        id: "user1-msg1",
        user: { name: "User1", avatar: "avatar1.png", color: "red" },
        message: "Hello world",
      },
      {
        id: "user2-msg2",
        user: { name: "User2", avatar: "avatar2.png", color: "blue" },
        message: "Another message",
      },
    ];

    (useCamsodaMessages as Mock).mockReturnValue({ messages: mockMessages });

    render(<CamsodaLocalTranslator />);

    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("User2")).toBeInTheDocument();
    expect(screen.getByText("Another message")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useCamsodaMessages as Mock).mockReturnValue({ messages: [] });
    render(<CamsodaLocalTranslator />);
    expect(screen.getByTestId("camsoda-local-translator")).toBeInTheDocument();
  });
});
