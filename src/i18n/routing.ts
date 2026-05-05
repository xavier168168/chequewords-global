import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh-Hant", "zh-Hans", "ja", "es", "fr", "de", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});
