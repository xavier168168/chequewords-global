import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChequeWordsHeader } from "@/components/ChequeWordsHeader";
import { LocaleHtmlAttributes } from "@/components/LocaleHtmlAttributes";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    manifest: "/manifest.json",
    appleWebApp: { capable: true, title: "ChequeWords" },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlAttributes />
      <div className="flex min-h-screen flex-col">
        <ChequeWordsHeader />
        <main className="flex-1">{children}</main>
        <footer className="no-print border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
          {(await getTranslations({ locale, namespace: "footer" }))(
            "disclaimer",
          )}
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
