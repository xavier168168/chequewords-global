import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function ChequeWordsHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {t("brand")}
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1"
          >
            {t("converter")}
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1"
          >
            {t("about")}
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
