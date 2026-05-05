import type { ChequeUnitLabels } from "../currencies";
import { toCardinal as arCardinal } from "n2words/ar-SA";
import { toCardinal as deCardinal } from "n2words/de-DE";
import { toCardinal as esCardinal } from "n2words/es-ES";
import { toCardinal as frCardinal } from "n2words/fr-FR";
import { toCardinal as hiCardinal } from "n2words/hi-IN";
import { toCardinal as itCardinal } from "n2words/it-IT";
import { toCardinal as ptCardinal } from "n2words/pt-PT";
import { toCardinal as ruCardinal } from "n2words/ru-RU";
import { toCardinal as thCardinal } from "n2words/th-TH";
import { toCardinal as viCardinal } from "n2words/vi-VN";

type CardinalFn = (n: number | bigint | string) => string;

function build(
  toCardinal: CardinalFn,
  major: bigint,
  minor: bigint,
  labels: ChequeUnitLabels,
  andWord: string,
  suffix: string,
): string {
  if (minor > 0n && labels.minorPlural && major === 0n) {
    const minLabel =
      minor === 1n ? labels.minorSingular! : labels.minorPlural;
    return `${toCardinal(minor)} ${minLabel} ${suffix}`.trim();
  }

  const majLabel =
    major === 1n ? labels.majorSingular : labels.majorPlural;
  const majWords = toCardinal(major);

  if (minor === 0n || !labels.minorPlural) {
    return `${majWords} ${majLabel} ${suffix}`.trim();
  }

  const minLabel =
    minor === 1n ? labels.minorSingular! : labels.minorPlural;
  const minWords = toCardinal(minor);
  return `${majWords} ${majLabel} ${andWord} ${minWords} ${minLabel} ${suffix}`.trim();
}

/** Number words in each language + English major/minor unit names + closing word. */
export const n2Western = {
  es: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(esCardinal, major, minor, labels, "y", "solamente"),
  fr: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(frCardinal, major, minor, labels, "et", "seulement"),
  de: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(deCardinal, major, minor, labels, "und", "nur"),
  pt: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(ptCardinal, major, minor, labels, "e", "somente"),
  it: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(itCardinal, major, minor, labels, "e", "soltanto"),
  ru: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(ruCardinal, major, minor, labels, "и", "только"),
  ar: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(arCardinal, major, minor, labels, "و", "فقط"),
  hi: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(hiCardinal, major, minor, labels, "और", "केवल"),
  vi: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(viCardinal, major, minor, labels, "và", "duy nhất"),
  th: (major: bigint, minor: bigint, labels: ChequeUnitLabels) =>
    build(thCardinal, major, minor, labels, "และ", "เท่านั้น"),
} as const;
