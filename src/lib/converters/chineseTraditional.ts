const DIGITS = ["零", "壹", "貳", "叁", "肆", "伍", "陸", "柒", "捌", "玖"] as const;
const UNITS = ["仟", "佰", "拾", ""];
const GROUPS = ["", "萬", "億", "兆"];

/** Convert integer 0..9999 to formal Chinese (one section). */
function sectionFour(n: number): string {
  if (n === 0) return "";
  const s = String(n).padStart(4, "0");
  let out = "";
  let lastWasZero = false;
  for (let i = 0; i < 4; i++) {
    const d = Number(s[i]);
    const u = UNITS[i];
    if (d === 0) {
      lastWasZero = true;
      continue;
    }
    if (lastWasZero && out.length > 0) {
      out += DIGITS[0];
    }
    lastWasZero = false;
    if (d === 1 && i === 2) {
      out += `${DIGITS[1]}拾`;
    } else {
      out += DIGITS[d] + u;
    }
  }
  return out.replace(new RegExp(`${DIGITS[0]}+$`), "");
}

function integerToChinese(n: bigint): string {
  if (n === 0n) return DIGITS[0];
  if (n < 0n) throw new Error("negative");

  const sections: number[] = [];
  let x = n;
  while (x > 0n) {
    sections.push(Number(x % 10000n));
    x /= 10000n;
  }

  let result = "";
  for (let i = sections.length - 1; i >= 0; i--) {
    const sec = sections[i]!;
    const gname = GROUPS[i] ?? "";
    if (sec === 0) continue;
    const inner = sectionFour(sec);
    if (result && sec < 1000) {
      result += DIGITS[0];
    }
    result += inner + gname;
  }
  result = result.replace(new RegExp(`${DIGITS[0]}+`, "g"), DIGITS[0]);
  result = result.replace(new RegExp(`^${DIGITS[0]}`), "");
  result = result.replace(new RegExp(`${DIGITS[0]}$`), "");
  return result || DIGITS[0];
}

/**
 * HK/TW style cheque: 元 / 角 / 分, 整 or 正 for exact yuan.
 */
export function convertChineseTraditionalCheque(
  major: bigint,
  minor: bigint,
  minorDigits: number,
): string {
  const intPart = integerToChinese(major);

  if (minorDigits === 0 || minor === 0n) {
    return `${intPart}元正`;
  }

  const scale = BigInt(10 ** minorDigits);
  const jiaoFen = minor * 100n / scale;
  const jiao = jiaoFen / 10n;
  const fen = jiaoFen % 10n;

  let tail = "";
  if (jiao > 0n) tail += `${integerToChinese(jiao)}角`;
  if (fen > 0n) {
    tail += `${integerToChinese(fen)}分`;
  } else if (jiao > 0n) {
    tail += "整";
  }

  if (jiao === 0n && fen > 0n) {
    tail = `${DIGITS[0]}${integerToChinese(fen)}分`;
  }

  return `${intPart}元${tail}`;
}
