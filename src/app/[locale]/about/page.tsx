import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <article className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="leading-relaxed">{t("p1")}</p>
      <p className="leading-relaxed">{t("p2")}</p>
      <p className="leading-relaxed">{t("p3")}</p>
      <Button asChild variant="outline">
        <Link href="/">{t("back")}</Link>
      </Button>
    </article>
  );
}
