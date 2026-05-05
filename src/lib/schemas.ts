import { z } from "zod";
import Decimal from "decimal.js";
import { MAX_AMOUNT, parseAmountInput } from "./format";
import { getCurrency } from "./currencies";

export const amountStringSchema = z
  .string()
  .min(1, "required")
  .transform((s) => s.trim())
  .superRefine((val, ctx) => {
    const d = parseAmountInput(val);
    if (d === null) {
      ctx.addIssue({ code: "custom", message: "invalidNumber" });
      return;
    }
    if (d.gt(MAX_AMOUNT)) {
      ctx.addIssue({ code: "custom", message: "tooLarge" });
    }
  });

export const currencyCodeSchema = z
  .string()
  .length(3)
  .transform((c) => c.toUpperCase())
  .refine((c) => !!getCurrency(c), "unknownCurrency");

export function safeParseAmount(raw: string): {
  ok: boolean;
  amount?: Decimal;
  error?: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  const d = parseAmountInput(trimmed);
  if (d === null) return { ok: false, error: "invalid" };
  if (d.gt(MAX_AMOUNT)) return { ok: false, error: "tooLarge" };
  return { ok: true, amount: d };
}
