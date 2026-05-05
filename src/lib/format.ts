import Decimal from "decimal.js";
import type { CurrencyDef } from "./currencies";

export const MAX_AMOUNT = new Decimal("999999999999.999999999"); // practical cap

/**
 * Split amount into major units and minor subunits (integer minor count).
 */
export function splitMajorMinor(
  amount: Decimal,
  minorDigits: number,
): { major: bigint; minor: bigint } {
  if (!amount.isFinite() || amount.isNaN()) {
    throw new Error("Invalid amount");
  }
  if (amount.isNegative()) {
    throw new Error("Cheque amounts must be non-negative");
  }

  const d = Math.min(10, Math.max(0, minorDigits));
  const fixed = amount.toDecimalPlaces(d, Decimal.ROUND_DOWN);
  const [intPart, frac = ""] = fixed.toFixed(d).split(".");
  const fracPadded = (frac + "0".repeat(d)).slice(0, d);

  return {
    major: BigInt(intPart || "0"),
    minor: BigInt(fracPadded || "0"),
  };
}

export function parseAmountInput(raw: string): Decimal | null {
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "" || cleaned === ".") return null;
  try {
    const d = new Decimal(cleaned);
    if (!d.isFinite() || d.isNaN()) return null;
    return d;
  } catch {
    return null;
  }
}

export function formatThousands(amount: Decimal, minorDigits: number): string {
  const d = Math.min(10, Math.max(0, minorDigits));
  const s = amount.toFixed(d);
  const [intPart, frac] = s.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac !== undefined && d > 0 ? `${withCommas}.${frac}` : withCommas;
}

export function clampToCurrencyDecimals(
  amount: Decimal,
  currency: CurrencyDef,
): Decimal {
  return amount.toDecimalPlaces(currency.digits, Decimal.ROUND_DOWN);
}
