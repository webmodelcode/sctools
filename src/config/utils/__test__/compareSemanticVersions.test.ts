import { describe, expect, it } from "vitest";
import { compareSemanticVersions } from "../compareSemanticVersions";

describe("compareSemanticVersions", () => {
  it("should return true when checkVersion is greater than currentVersion", () => {
    expect(compareSemanticVersions("2.0.0", "1.0.0")).toBe(true);
    expect(compareSemanticVersions("1.1.0", "1.0.0")).toBe(true);
    expect(compareSemanticVersions("1.0.1", "1.0.0")).toBe(true);
  });

  it("should return false when checkVersion is equal to currentVersion", () => {
    expect(compareSemanticVersions("1.0.0", "1.0.0")).toBe(false);
    expect(compareSemanticVersions("2.1.3", "2.1.3")).toBe(false);
  });

  it("should return false when checkVersion is less than currentVersion", () => {
    expect(compareSemanticVersions("1.0.0", "2.0.0")).toBe(false);
    expect(compareSemanticVersions("1.0.0", "1.1.0")).toBe(false);
    expect(compareSemanticVersions("1.0.0", "1.0.1")).toBe(false);
  });

  it("should handle versions with missing segments by padding with zeros", () => {
    expect(compareSemanticVersions("1.1", "1.0.0")).toBe(true);
    expect(compareSemanticVersions("1", "0.9.9")).toBe(true);
    expect(compareSemanticVersions("2", "2.0")).toBe(false);
    expect(compareSemanticVersions("1.0", "1.0.0")).toBe(false);
  });

  it("should handle edge cases with zero versions", () => {
    expect(compareSemanticVersions("0.0.1", "0.0.0")).toBe(true);
    expect(compareSemanticVersions("0.1.0", "0.0.9")).toBe(true);
    expect(compareSemanticVersions("0.0.0", "0.0.0")).toBe(false);
  });

  it("should handle large version numbers", () => {
    expect(compareSemanticVersions("10.0.0", "9.99.99")).toBe(true);
    expect(compareSemanticVersions("1.100.0", "1.99.0")).toBe(true);
    expect(compareSemanticVersions("1.0.100", "1.0.99")).toBe(true);
  });

  it("should handle mixed format versions", () => {
    expect(compareSemanticVersions("2.0", "1.9.9")).toBe(true);
    expect(compareSemanticVersions("1.1", "1.0.9")).toBe(true);
    expect(compareSemanticVersions("1", "0.9")).toBe(true);
  });
});