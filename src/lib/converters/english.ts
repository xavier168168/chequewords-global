import { toCardinal } from "n2words/en-US";
import type { ChequeUnitLabels } from "../currencies";

function capitalizeEnglishChequeWords(s: string): string {
  return s
    .split(" ")
    .map((word) => {
      if (word.toLowerCase() === "and") return "and";
      return word
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join("-");
    })
    .join(" ");
}

/**
 * International English cheque line: cardinal words + unit names + "Only".
 */
export function convertEnglishCheque(
  major: bigint,
  minor: bigint,
  labels: ChequeUnitLabels,
): string {
  const chunks: string[] = [];

  if (major > 0n || minor === 0n) {
    const words = capitalizeEnglishChequeWords(toCardinal(major));
    const maj =
      major === 1n ? labels.majorSingular : labels.majorPlural;
    chunks.push(`${words} ${maj}`);
  }

  if (minor > 0n) {
    const minLabel =
      minor === 1n ? labels.minorSingular : labels.minorPlural;
    if (!minLabel) {
      throw new Error("Currency has no minor unit but minor amount > 0");
    }
    const words = capitalizeEnglishChequeWords(toCardinal(minor));
    if (chunks.length) {
      chunks.push(`and ${words} ${minLabel}`);
    } else {
      chunks.push(`${words} ${minLabel}`);
    }
  }

  return `${chunks.join(" ")} Only`;
}
