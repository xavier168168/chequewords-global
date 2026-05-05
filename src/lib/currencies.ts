import type { CurrencyCodeRecord } from "currency-codes";
// `data` exists at runtime but is missing from published typings.
import * as CurrencyCodes from "currency-codes";

const isoData = (CurrencyCodes as unknown as { data: CurrencyCodeRecord[] }).data;

/** English labels for cheque wording (major / minor subunit). */
export type ChequeUnitLabels = {
  majorSingular: string;
  majorPlural: string;
  minorSingular?: string;
  minorPlural?: string;
};

const OVERRIDES: Record<string, ChequeUnitLabels> = {
  USD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  EUR: {
    majorSingular: "Euro",
    majorPlural: "Euros",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  GBP: {
    majorSingular: "Pound",
    majorPlural: "Pounds",
    minorSingular: "Penny",
    minorPlural: "Pence",
  },
  HKD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  CNY: {
    majorSingular: "Yuan",
    majorPlural: "Yuan",
    minorSingular: "Jiao",
    minorPlural: "Jiao",
  },
  JPY: {
    majorSingular: "Yen",
    majorPlural: "Yen",
  },
  KRW: {
    majorSingular: "Won",
    majorPlural: "Won",
  },
  CHF: {
    majorSingular: "Franc",
    majorPlural: "Francs",
    minorSingular: "Rappen",
    minorPlural: "Rappen",
  },
  CAD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  AUD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  NZD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  SGD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  INR: {
    majorSingular: "Rupee",
    majorPlural: "Rupees",
    minorSingular: "Paisa",
    minorPlural: "Paise",
  },
  THB: {
    majorSingular: "Baht",
    majorPlural: "Baht",
    minorSingular: "Satang",
    minorPlural: "Satang",
  },
  MYR: {
    majorSingular: "Ringgit",
    majorPlural: "Ringgit",
    minorSingular: "Sen",
    minorPlural: "Sen",
  },
  AED: {
    majorSingular: "Dirham",
    majorPlural: "Dirhams",
    minorSingular: "Fils",
    minorPlural: "Fils",
  },
  SAR: {
    majorSingular: "Riyal",
    majorPlural: "Riyals",
    minorSingular: "Halalah",
    minorPlural: "Halalah",
  },
  KWD: {
    majorSingular: "Dinar",
    majorPlural: "Dinars",
    minorSingular: "Fils",
    minorPlural: "Fils",
  },
  BHD: {
    majorSingular: "Dinar",
    majorPlural: "Dinars",
    minorSingular: "Fils",
    minorPlural: "Fils",
  },
  OMR: {
    majorSingular: "Rial",
    majorPlural: "Rials",
    minorSingular: "Baisa",
    minorPlural: "Baisa",
  },
  JOD: {
    majorSingular: "Dinar",
    majorPlural: "Dinars",
    minorSingular: "Piastre",
    minorPlural: "Piastres",
  },
  ILS: {
    majorSingular: "Shekel",
    majorPlural: "Shekels",
    minorSingular: "Agora",
    minorPlural: "Agorot",
  },
  ZAR: {
    majorSingular: "Rand",
    majorPlural: "Rand",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
  MXN: {
    majorSingular: "Peso",
    majorPlural: "Pesos",
    minorSingular: "Centavo",
    minorPlural: "Centavos",
  },
  BRL: {
    majorSingular: "Real",
    majorPlural: "Reais",
    minorSingular: "Centavo",
    minorPlural: "Centavos",
  },
  SEK: {
    majorSingular: "Krona",
    majorPlural: "Kronor",
    minorSingular: "Öre",
    minorPlural: "Öre",
  },
  NOK: {
    majorSingular: "Krone",
    majorPlural: "Kroner",
    minorSingular: "Øre",
    minorPlural: "Øre",
  },
  DKK: {
    majorSingular: "Krone",
    majorPlural: "Kroner",
    minorSingular: "Øre",
    minorPlural: "Øre",
  },
  PLN: {
    majorSingular: "Złoty",
    majorPlural: "Złoty",
    minorSingular: "Grosz",
    minorPlural: "Groszy",
  },
  CZK: {
    majorSingular: "Koruna",
    majorPlural: "Koruny",
    minorSingular: "Haléř",
    minorPlural: "Haléře",
  },
  HUF: {
    majorSingular: "Forint",
    majorPlural: "Forint",
  },
  RUB: {
    majorSingular: "Ruble",
    majorPlural: "Rubles",
    minorSingular: "Kopek",
    minorPlural: "Kopeks",
  },
  TRY: {
    majorSingular: "Lira",
    majorPlural: "Lira",
    minorSingular: "Kuruş",
    minorPlural: "Kuruş",
  },
  IDR: {
    majorSingular: "Rupiah",
    majorPlural: "Rupiah",
  },
  VND: {
    majorSingular: "Dong",
    majorPlural: "Dong",
    minorSingular: "Xu",
    minorPlural: "Xu",
  },
  PHP: {
    majorSingular: "Peso",
    majorPlural: "Pesos",
    minorSingular: "Centavo",
    minorPlural: "Centavos",
  },
  TWD: {
    majorSingular: "Dollar",
    majorPlural: "Dollars",
    minorSingular: "Cent",
    minorPlural: "Cents",
  },
};

function inferLabels(
  rec: CurrencyCodeRecord,
): ChequeUnitLabels {
  const digits = rec.digits;
  const name = rec.currency.replace(/\s*\(The\)\s*$/i, "").trim();

  if (digits === 0) {
    const plural = pluralizeIsoName(name);
    return { majorSingular: name, majorPlural: plural };
  }

  const lower = name.toLowerCase();
  if (lower.includes("dollar")) {
    return {
      majorSingular: "Dollar",
      majorPlural: "Dollars",
      minorSingular: "Cent",
      minorPlural: "Cents",
    };
  }
  if (lower.includes("pound") || lower.includes("sterling")) {
    return {
      majorSingular: "Pound",
      majorPlural: "Pounds",
      minorSingular: "Penny",
      minorPlural: "Pence",
    };
  }
  if (lower.includes("euro")) {
    return {
      majorSingular: "Euro",
      majorPlural: "Euros",
      minorSingular: "Cent",
      minorPlural: "Cents",
    };
  }
  if (lower.includes("yen") || lower.includes("yuan")) {
    return {
      majorSingular: name.split(" ")[0] ?? name,
      majorPlural: name.split(" ")[0] ?? name,
    };
  }
  if (lower.includes("franc")) {
    return {
      majorSingular: "Franc",
      majorPlural: "Francs",
      minorSingular: "Centime",
      minorPlural: "Centimes",
    };
  }
  if (lower.includes("peso")) {
    return {
      majorSingular: "Peso",
      majorPlural: "Pesos",
      minorSingular: "Centavo",
      minorPlural: "Centavos",
    };
  }
  if (lower.includes("rupee")) {
    return {
      majorSingular: "Rupee",
      majorPlural: "Rupees",
      minorSingular: "Paisa",
      minorPlural: "Paise",
    };
  }
  if (lower.includes("krone") || lower.includes("krona")) {
    return {
      majorSingular: name.includes("Norwegian")
        ? "Krone"
        : name.includes("Danish")
          ? "Krone"
          : "Krona",
      majorPlural: name.includes("Swedish") ? "Kronor" : "Kroner",
      minorSingular: "Øre",
      minorPlural: "Øre",
    };
  }

  return {
    majorSingular: name,
    majorPlural: pluralizeIsoName(name),
    minorSingular: "Cent",
    minorPlural: "Cents",
  };
}

function pluralizeIsoName(name: string): string {
  const n = name.toLowerCase();
  if (n.endsWith("y") && !/[aeiou]y$/i.test(name)) {
    return `${name.slice(0, -1)}ies`;
  }
  if (/(s|x|z|ch|sh)$/i.test(name)) {
    return `${name}es`;
  }
  return `${name}s`;
}

export type CurrencyDef = {
  code: string;
  number: string;
  digits: number;
  nameEn: string;
  countries: string[];
  labels: ChequeUnitLabels;
};

const CACHE: CurrencyDef[] = isoData
  .filter((r) => r.code && typeof r.digits === "number")
  .map((rec) => ({
    code: rec.code,
    number: rec.number,
    digits: rec.digits,
    nameEn: rec.currency,
    countries: rec.countries ?? [],
    labels: OVERRIDES[rec.code] ?? inferLabels(rec),
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

export function getAllCurrencies(): CurrencyDef[] {
  return CACHE;
}

export function getCurrency(code: string): CurrencyDef | undefined {
  const c = code.toUpperCase();
  return CACHE.find((x) => x.code === c);
}

export function searchCurrencies(query: string, limit = 80): CurrencyDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return CACHE.slice(0, limit);
  return CACHE.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.countries.some((co) => co.toLowerCase().includes(q)),
  ).slice(0, limit);
}
