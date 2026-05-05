# ChequeWords — Global Cheque Amount Converter

A production-ready cheque amount converter that supports:

- 15+ output languages (including formal Chinese cheque uppercase and Japanese daiji style)
- 150+ ISO 4217 currencies
- Per-currency minor unit handling (e.g. 0, 2, 3 decimal currencies)
- Multi-locale UI routes (`/en`, `/zh-Hant`, `/ja`, `/ar`, etc.)
- Cheque preview layouts (NA / UK / HK / JP / Euro)
- Copy, share-link hash state, print mode
- PWA basics (`manifest.json` + service worker)

## Tech stack

- Next.js 15 (App Router) with static export
- TypeScript
- Tailwind CSS v4
- next-intl (i18n routing + messages)
- decimal.js (precision-safe amount handling)
- n2words (multi-language number-to-words for many languages)
- Radix primitives + utility UI components
- Vitest for converter/unit tests

## Project structure

- `src/app/[locale]/page.tsx` — converter page
- `src/app/[locale]/about/page.tsx` — regional cheque tips
- `src/components/ChequeConverter.tsx` — core UI workflow
- `src/components/ChequePreview.tsx` — SVG cheque preview
- `src/lib/currencies.ts` — ISO currency dataset + cheque unit labels
- `src/lib/format.ts` — decimal parsing/formatting/splitting helpers
- `src/lib/converters/*` — language converter implementations + dispatcher
- `src/messages/*.json` — UI translations

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
pnpm lint
pnpm test
pnpm build
```

## Add a new output language

1. Add the language id to `src/lib/converters/types.ts`.
2. Implement converter logic in `src/lib/converters/<lang>.ts`.
3. Wire it in `src/lib/converters/index.ts`.
4. Add label text in all `src/messages/*.json` under `outLang`.
5. Add tests in `src/lib/converters/<lang>.test.ts`.

## Add/override a currency rule

1. Update `OVERRIDES` in `src/lib/currencies.ts`.
2. Define:
   - major singular/plural (e.g. `Dollar` / `Dollars`)
   - minor singular/plural (e.g. `Cent` / `Cents`) if currency has subunit
3. Verify generated output from the converter page.
4. Add test cases where currency behavior differs.

## Static deployment

This project is configured with `output: "export"` and can be deployed on:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel static hosting

Build output is generated via:

```bash
pnpm build
```

Then deploy the generated static output directory according to your host.
