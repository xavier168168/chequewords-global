import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";
import { splitMajorMinor } from "./format";

describe("splitMajorMinor", () => {
  it("splits USD-style 2 decimals", () => {
    const { major, minor } = splitMajorMinor(new Decimal("123.45"), 2);
    expect(major).toBe(123n);
    expect(minor).toBe(45n);
  });

  it("handles zero minor", () => {
    const { major, minor } = splitMajorMinor(new Decimal("100"), 2);
    expect(major).toBe(100n);
    expect(minor).toBe(0n);
  });

  it("handles 3 decimal places", () => {
    const { major, minor } = splitMajorMinor(new Decimal("1.234"), 3);
    expect(major).toBe(1n);
    expect(minor).toBe(234n);
  });
});
