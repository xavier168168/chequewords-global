"use client";

export type ChequePreviewVariant =
  | "northAmerica"
  | "uk"
  | "hongKong"
  | "japan"
  | "euro";

type Props = {
  variant: ChequePreviewVariant;
  payeeLine: string;
  amountFigures: string;
  amountWords: string;
  currencyCode: string;
  dateLine: string;
  bankHint?: string;
};

export function ChequePreview({
  variant,
  payeeLine,
  amountFigures,
  amountWords,
  currencyCode,
  dateLine,
  bankHint,
}: Props) {
  const isJp = variant === "japan";
  const isEuro = variant === "euro";

  return (
    <div className="print-block w-full overflow-x-auto rounded-xl border border-amber-200 bg-gradient-to-br from-[#fbf9f2] to-[#f3efe3] p-4 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <svg
        viewBox="0 0 720 280"
        className="mx-auto h-auto w-full max-w-[720px]"
        role="img"
        aria-label="Cheque preview"
      >
        <defs>
          <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcfbf7" />
            <stop offset="100%" stopColor="#f3efe2" />
          </linearGradient>
        </defs>
        <rect width="720" height="280" fill="url(#cardBg)" stroke="#bfae85" rx="6" />
        <text x="24" y="36" fontSize="11" fill="#555">
          {variant === "northAmerica"
            ? "PAY TO THE ORDER OF"
            : variant === "uk"
              ? "Pay"
              : variant === "hongKong"
                ? "Pay / 支付"
                : isJp
                  ? "支払金額"
                  : isEuro
                    ? "Payez contre ce chèque"
                    : "PAY"}
        </text>
        <text
          x="24"
          y="64"
          fontSize="18"
          fontWeight="600"
          fill="#111"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {payeeLine}
        </text>
        <rect x="24" y="78" width="500" height="44" fill="#fffefb" stroke="#9f9482" rx="2" />
        <text
          x="32"
          y="106"
          fontSize="12"
          fill="#111"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {amountWords.length > 90
            ? `${amountWords.slice(0, 90)}…`
            : amountWords}
        </text>
        <text x="540" y="100" fontSize="12" fill="#555">
          {currencyCode}
        </text>
        <text x="540" y="120" fontSize="22" fontWeight="700" fill="#111">
          {amountFigures}
        </text>
        <text x="24" y="160" fontSize="11" fill="#555">
          {variant === "japan" ? "日付" : variant === "euro" ? "Date" : "DATE"}
        </text>
        <text x="24" y="182" fontSize="13" fill="#111">
          {dateLine}
        </text>
        <line x1="24" y1="210" x2="340" y2="210" stroke="#333" />
        <text x="24" y="228" fontSize="10" fill="#666">
          {variant === "hongKong"
            ? "Authorised signature / 簽署"
            : "Authorised signature"}
        </text>
        <line x1="400" y1="210" x2="696" y2="210" stroke="#333" />
        <text x="400" y="228" fontSize="10" fill="#666">
          MICR ·····|: ·····: ·····
        </text>
        {bankHint ? (
          <text x="24" y="260" fontSize="10" fill="#71634a">
            Template: {bankHint}
          </text>
        ) : null}
      </svg>
    </div>
  );
}
