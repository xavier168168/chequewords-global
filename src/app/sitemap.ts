import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
    });
    entries.push({
      url: `${base}/${locale}/about`,
      lastModified: new Date(),
    });
  }
  return entries;
}
