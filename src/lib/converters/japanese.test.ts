import { describe, expect, it } from "vitest";
import { convertJapaneseCheque } from "./japanese";

describe("convertJapaneseCheque", () => {
  it("wraps integer yen with 金…円也", () => {
    const s = convertJapaneseCheque(12345n, 0n, 0);
    expect(s.startsWith("金")).toBe(true);
    expect(s.endsWith("円也")).toBe(true);
  });
});
