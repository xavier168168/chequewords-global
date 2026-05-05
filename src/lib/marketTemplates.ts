import type { ChequePreviewVariant } from "@/components/ChequePreview";

export type MarketTemplate = {
  id: "global" | "hk-bank" | "jp-bank" | "uk-bank" | "us-bank";
  name: string;
  previewVariant: ChequePreviewVariant;
  currencyCode: string;
  payeeLine: string;
  bankHint: string;
  dateLocale: string;
};

export const MARKET_TEMPLATES: MarketTemplate[] = [
  {
    id: "global",
    name: "Global Default",
    previewVariant: "northAmerica",
    currencyCode: "USD",
    payeeLine: "Pay to the order of ____________________",
    bankHint: "Universal style for international drafts",
    dateLocale: "en-US",
  },
  {
    id: "hk-bank",
    name: "Hong Kong Bank Style",
    previewVariant: "hongKong",
    currencyCode: "HKD",
    payeeLine: "致 ____________________",
    bankHint: "Crossed cheque and formal Chinese wording",
    dateLocale: "zh-HK",
  },
  {
    id: "jp-bank",
    name: "Japan Bank Style",
    previewVariant: "japan",
    currencyCode: "JPY",
    payeeLine: "受取人 ____________________",
    bankHint: "Daiji amount style with 円也 convention",
    dateLocale: "ja-JP",
  },
  {
    id: "uk-bank",
    name: "UK Bank Style",
    previewVariant: "uk",
    currencyCode: "GBP",
    payeeLine: "Pay ____________________",
    bankHint: "Sterling cheque line convention",
    dateLocale: "en-GB",
  },
  {
    id: "us-bank",
    name: "US Bank Style",
    previewVariant: "northAmerica",
    currencyCode: "USD",
    payeeLine: "Pay to the order of ____________________",
    bankHint: "US cheque layout with dollars/cents line",
    dateLocale: "en-US",
  },
];

export function getTemplateById(id: string): MarketTemplate {
  return MARKET_TEMPLATES.find((x) => x.id === id) ?? MARKET_TEMPLATES[0];
}
