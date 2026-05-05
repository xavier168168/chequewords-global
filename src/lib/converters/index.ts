import Decimal from "decimal.js";
import type { CurrencyDef } from "../currencies";
import { splitMajorMinor } from "../format";
import { convertEnglishCheque } from "./english";
import { convertChineseSimplifiedCheque } from "./chineseSimplified";
import { convertChineseTraditionalCheque } from "./chineseTraditional";
import { convertJapaneseCheque } from "./japanese";
import { convertKoreanCheque } from "./korean";
import { n2Western } from "./n2western";
import type { ConvertResult, OutputLanguageId } from "./types";
import { OUTPUT_LANGUAGE_IDS } from "./types";

function dispatch(
  id: OutputLanguageId,
  major: bigint,
  minor: bigint,
  digits: number,
  labels: import("../currencies").ChequeUnitLabels,
): string {
  switch (id) {
    case "en":
      return convertEnglishCheque(major, minor, labels);
    case "zh-Hant":
      return convertChineseTraditionalCheque(major, minor, digits);
    case "zh-Hans":
      return convertChineseSimplifiedCheque(major, minor, digits);
    case "ja":
      return convertJapaneseCheque(major, minor, digits);
    case "ko":
      return convertKoreanCheque(major, minor, digits);
    case "es":
      return n2Western.es(major, minor, labels);
    case "fr":
      return n2Western.fr(major, minor, labels);
    case "de":
      return n2Western.de(major, minor, labels);
    case "pt":
      return n2Western.pt(major, minor, labels);
    case "it":
      return n2Western.it(major, minor, labels);
    case "ru":
      return n2Western.ru(major, minor, labels);
    case "ar":
      return n2Western.ar(major, minor, labels);
    case "hi":
      return n2Western.hi(major, minor, labels);
    case "vi":
      return n2Western.vi(major, minor, labels);
    case "th":
      return n2Western.th(major, minor, labels);
  }
}

export function convertAllOutputs(
  amount: Decimal,
  currency: CurrencyDef,
  selected?: OutputLanguageId[],
): ConvertResult[] {
  const { major, minor } = splitMajorMinor(amount, currency.digits);
  const ids = selected?.length ? selected : OUTPUT_LANGUAGE_IDS;
  const labels = currency.labels;

  return ids.map((id) => {
    try {
      const text = dispatch(id, major, minor, currency.digits, labels);
      return {
        id,
        labelKey: `outLang.${id}`,
        text,
      };
    } catch (e) {
      return {
        id,
        labelKey: `outLang.${id}`,
        text: "",
        error: e instanceof Error ? e.message : String(e),
      };
    }
  });
}

export type { ConvertResult, OutputLanguageId } from "./types";
export { OUTPUT_LANGUAGE_IDS } from "./types";
