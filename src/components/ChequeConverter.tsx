"use client";

import { Copy, Link2, Printer, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChequePreview, type ChequePreviewVariant } from "@/components/ChequePreview";
import { getCurrency, searchCurrencies, type CurrencyDef } from "@/lib/currencies";
import {
  convertAllOutputs,
  OUTPUT_LANGUAGE_IDS,
  type OutputLanguageId,
} from "@/lib/converters";
import { clampToCurrencyDecimals, formatThousands } from "@/lib/format";
import { safeParseAmount } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
  getTemplateById,
  MARKET_TEMPLATES,
  type MarketTemplate,
} from "@/lib/marketTemplates";

const PREVIEW_VARIANTS: ChequePreviewVariant[] = [
  "northAmerica",
  "uk",
  "hongKong",
  "japan",
  "euro",
];

function parseHash(): {
  amount: string;
  ccy: string;
  out: OutputLanguageId[];
  preview: ChequePreviewVariant;
  template: MarketTemplate["id"];
} | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.replace(/^#/, "");
  if (!h.startsWith("?")) return null;
  const q = new URLSearchParams(h.slice(1));
  const amount = q.get("amount") ?? "";
  const ccy = (q.get("ccy") ?? "USD").toUpperCase();
  const outRaw = q.get("out");
  const out = outRaw
    ? (outRaw
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is OutputLanguageId =>
          (OUTPUT_LANGUAGE_IDS as string[]).includes(s),
        ) as OutputLanguageId[])
    : [...OUTPUT_LANGUAGE_IDS];
  const preview = (q.get("preview") ?? "northAmerica") as ChequePreviewVariant;
  const template = (q.get("tpl") ?? "global") as MarketTemplate["id"];
  const pv = PREVIEW_VARIANTS.includes(preview) ? preview : "northAmerica";
  return {
    amount,
    ccy,
    out: out.length ? out : [...OUTPUT_LANGUAGE_IDS],
    preview: pv,
    template,
  };
}

export function ChequeConverter() {
  const t = useTranslations("converter");
  const tOut = useTranslations("outLang");
  const tAct = useTranslations("actions");
  const currencySearchRef = useRef<HTMLInputElement>(null);

  const [amountStr, setAmountStr] = useState("1234.56");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [currencySearch, setCurrencySearch] = useState("");
  const [previewVariant, setPreviewVariant] =
    useState<ChequePreviewVariant>("northAmerica");
  const [templateId, setTemplateId] = useState<MarketTemplate["id"]>("global");
  const [selectedOut, setSelectedOut] = useState<OutputLanguageId[]>([
    ...OUTPUT_LANGUAGE_IDS,
  ]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState(amountStr);

  useEffect(() => {
    const tmr = setTimeout(() => setDebouncedAmount(amountStr), 120);
    return () => clearTimeout(tmr);
  }, [amountStr]);

  useEffect(() => {
    const parsed = parseHash();
    if (!parsed) return;
    if (parsed.amount) setAmountStr(parsed.amount);
    if (getCurrency(parsed.ccy)) setCurrencyCode(parsed.ccy);
    if (parsed.out.length) setSelectedOut(parsed.out);
    setPreviewVariant(parsed.preview);
    setTemplateId(parsed.template);
  }, []);

  useEffect(() => {
    const parsed = safeParseAmount(debouncedAmount);
    if (!parsed.ok) return;
    const cur = getCurrency(currencyCode);
    if (!cur) return;
    const params = new URLSearchParams();
    params.set("amount", debouncedAmount.replace(/,/g, "").trim());
    params.set("ccy", currencyCode);
    params.set("out", selectedOut.join(","));
    params.set("preview", previewVariant);
    params.set("tpl", templateId);
    const next = `#?${params.toString()}`;
    if (typeof window !== "undefined" && window.location.hash !== next) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${next}`,
      );
    }
  }, [debouncedAmount, currencyCode, selectedOut, previewVariant, templateId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const cur = getCurrency(currencyCode);
        const p = safeParseAmount(debouncedAmount);
        if (p.ok && cur) {
          const lines = convertAllOutputs(p.amount!, cur, ["en"]);
          void navigator.clipboard.writeText(lines[0]?.text ?? "");
          toast.success(tAct("copied"));
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        currencySearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currencyCode, debouncedAmount, tAct]);

  const currency = getCurrency(currencyCode);
  const parsed = useMemo(
    () => safeParseAmount(debouncedAmount),
    [debouncedAmount],
  );

  const results = useMemo(() => {
    if (!parsed.ok || !currency) return [];
    const amt = clampToCurrencyDecimals(parsed.amount!, currency);
    return convertAllOutputs(amt, currency, selectedOut);
  }, [parsed, currency, selectedOut]);

  const englishLine =
    results.find((r) => r.id === "en")?.text ?? "—";

  const amountFigures =
    parsed.ok && currency
      ? `${formatThousands(
          clampToCurrencyDecimals(parsed.amount!, currency),
          currency.digits,
        )} ${currency.code}`
      : "—";

  const toggleLang = (id: OutputLanguageId) => {
    setSelectedOut((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(tAct("copied"));
  };

  const shareLink = useCallback(() => {
    const cur = getCurrency(currencyCode);
    const p = safeParseAmount(debouncedAmount);
    if (!p.ok || !cur) {
      toast.error(t("errors.invalid"));
      return;
    }
    const params = new URLSearchParams();
    params.set("amount", debouncedAmount.replace(/,/g, "").trim());
    params.set("ccy", currencyCode);
    params.set("out", selectedOut.join(","));
    params.set("preview", previewVariant);
    params.set("tpl", templateId);
    const url = `${window.location.origin}${window.location.pathname}#?${params.toString()}`;
    void navigator.clipboard.writeText(url);
    toast.success(tAct("shareDone"));
  }, [
    currencyCode,
    debouncedAmount,
    previewVariant,
    selectedOut,
    templateId,
    t,
    tAct,
  ]);

  const currencyList = useMemo(
    () => searchCurrencies(currencySearch || currencyCode, 60),
    [currencySearch, currencyCode],
  );

  const errorMsg =
    parsed.error === "empty"
      ? t("errors.empty")
      : parsed.error === "invalid"
        ? t("errors.invalid")
        : parsed.error === "tooLarge"
          ? t("errors.tooLarge")
          : null;
  const activeTemplate = getTemplateById(templateId);
  const displayDate = new Intl.DateTimeFormat(activeTemplate.dateLocale, {
    dateStyle: "medium",
  }).format(new Date());

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="no-print rounded-2xl border border-border bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-fuchsia-600/10 p-6 shadow-sm space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl">{t("subtitle")}</p>
        <p className="text-muted-foreground text-sm">{t("shortcuts")}</p>
      </header>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>{t("amountLabel")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">{t("amountLabel")}</Label>
            <Input
              id="amount"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder={t("amountPlaceholder")}
              aria-invalid={!!errorMsg}
            />
            {errorMsg && (
              <p className="text-sm text-red-500" role="alert">
                {errorMsg}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("currencyLabel")}</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="truncate">
                    {currency
                      ? `${currency.code} — ${currency.nameEn}`
                      : currencyCode}
                  </span>
                  <Search className="h-4 w-4 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(100vw-2rem,28rem)] p-0">
                <div className="border-b border-border p-2">
                  <Input
                    ref={currencySearchRef}
                    placeholder={t("currencySearch")}
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                  />
                </div>
                <ul
                  className="max-h-64 overflow-y-auto py-1 text-sm"
                  role="listbox"
                >
                  {currencyList.map((c: CurrencyDef) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full flex-col px-3 py-2 text-left hover:bg-muted",
                          c.code === currencyCode && "bg-muted",
                        )}
                        onClick={() => {
                          setCurrencyCode(c.code);
                          setCurrencySearch("");
                          setPopoverOpen(false);
                        }}
                      >
                        <span className="font-mono font-semibold">{c.code}</span>
                        <span className="text-muted-foreground text-xs">
                          {c.nameEn}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>Bank / Market Template</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {MARKET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className={cn(
                "rounded-xl border p-4 text-left transition hover:bg-muted",
                templateId === tpl.id
                  ? "border-accent bg-accent/5"
                  : "border-border",
              )}
              onClick={() => {
                setTemplateId(tpl.id);
                setPreviewVariant(tpl.previewVariant);
                if (getCurrency(tpl.currencyCode)) setCurrencyCode(tpl.currencyCode);
              }}
            >
              <p className="font-semibold">{tpl.name}</p>
              <p className="text-xs text-muted-foreground">{tpl.bankHint}</p>
              <p className="mt-1 text-xs font-mono text-muted-foreground">
                {tpl.currencyCode} · {tpl.previewVariant}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <section className="no-print space-y-3">
        <h2 className="text-lg font-semibold">{t("outputLabel")}</h2>
        <div className="flex flex-wrap gap-2">
          {OUTPUT_LANGUAGE_IDS.map((id) => (
            <label
              key={id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-sm",
                selectedOut.includes(id)
                  ? "border-accent bg-muted"
                  : "border-border opacity-60",
              )}
            >
              <input
                type="checkbox"
                className="accent-accent"
                checked={selectedOut.includes(id)}
                onChange={() => toggleLang(id)}
              />
              {tOut(id)}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="no-print flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t("previewLabel")}</h2>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={shareLink}>
              <Link2 className="h-4 w-4" />
              {tAct("share")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              {tAct("print")}
            </Button>
          </div>
        </div>
        <Tabs
          value={previewVariant}
          onValueChange={(v) =>
            setPreviewVariant(v as ChequePreviewVariant)
          }
          className="no-print"
        >
          <TabsList className="flex flex-wrap h-auto gap-1">
            {PREVIEW_VARIANTS.map((v) => (
              <TabsTrigger key={v} value={v} className="text-xs">
                {t(`preview.${v}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          {PREVIEW_VARIANTS.map((v) => (
            <TabsContent key={v} value={v} className="mt-4">
              <ChequePreview
                variant={v}
                payeeLine={activeTemplate.payeeLine}
                amountFigures={amountFigures}
                amountWords={englishLine}
                currencyCode={currency?.code ?? ""}
                dateLine={displayDate}
                bankHint={activeTemplate.bankHint}
              />
            </TabsContent>
          ))}
        </Tabs>
        <div className="print-block hidden print:block">
          <ChequePreview
            variant={previewVariant}
            payeeLine={activeTemplate.payeeLine}
            amountFigures={amountFigures}
            amountWords={englishLine}
            currencyCode={currency?.code ?? ""}
            dateLine={displayDate}
            bankHint={activeTemplate.bankHint}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {results.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{tOut(r.id)}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="no-print"
                onClick={() => void copyText(r.text)}
                aria-label={tAct("copy")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {r.error ? (
                <p className="text-sm text-red-500">{r.error}</p>
              ) : (
                <p className="text-sm leading-relaxed break-words">{r.text}</p>
              )}
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
