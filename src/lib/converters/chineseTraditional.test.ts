import { describe, expect, it } from "vitest";
import { convertChineseTraditionalCheque } from "./chineseTraditional";

describe("convertChineseTraditionalCheque", () => {
  it("writes 元正 for whole amount", () => {
    expect(convertChineseTraditionalCheque(10000n, 0n, 2)).toContain("元正");
  });

  it("handles 12345 with cents", () => {
    const s = convertChineseTraditionalCheque(12345n, 67n, 2);
    expect(s).toContain("元");
    expect(s).toMatch(/角|分|整/);
  });
});
