export type OutputLanguageId =
  | "en"
  | "zh-Hant"
  | "zh-Hans"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "ru"
  | "ar"
  | "hi"
  | "vi"
  | "th";

export const OUTPUT_LANGUAGE_IDS: OutputLanguageId[] = [
  "en",
  "zh-Hant",
  "zh-Hans",
  "ja",
  "ko",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "ru",
  "ar",
  "hi",
  "vi",
  "th",
];

export type ConvertResult = {
  id: OutputLanguageId;
  labelKey: string;
  text: string;
  error?: string;
};
