import { describe, expect, it } from "vitest";
import { convertEnglishCheque } from "./english";
import type { ChequeUnitLabels } from "../currencies";

const usd: ChequeUnitLabels = {
  majorSingular: "Dollar",
  majorPlural: "Dollars",
  minorSingular: "Cent",
  minorPlural: "Cents",
};

const gbp: ChequeUnitLabels = {
  majorSingular: "Pound",
  majorPlural: "Pounds",
  minorSingular: "Penny",
  minorPlural: "Pence",
};

describe("convertEnglishCheque", () => {
  it("formats whole dollars with Only", () => {
    expect(convertEnglishCheque(1n, 0n, usd)).toMatch(/One Dollar Only$/);
    expect(convertEnglishCheque(1234n, 0n, usd)).toMatch(/Only$/);
  });

  it("formats dollars and cents", () => {
    const s = convertEnglishCheque(10n, 50n, usd);
    expect(s).toContain("and");
    expect(s).toContain("Cents");
    expect(s).toMatch(/Only$/);
  });

  it("formats cents only", () => {
    const s = convertEnglishCheque(0n, 1n, usd);
    expect(s).toContain("Cent");
    expect(s).toMatch(/Only$/);
  });

  it("uses pence for GBP", () => {
    const s = convertEnglishCheque(1n, 1n, gbp);
    expect(s).toContain("Penny");
  });
});
