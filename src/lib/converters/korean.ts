import { toCardinal } from "n2words/ko-KR";

const HANJA = ["零", "壹", "貳", "參", "四", "五", "六", "七", "八", "九"] as const;
const UNITS = ["仟", "佰", "拾", ""];
const GROUPS = ["", "萬", "億", "兆"];

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
      out += HANJA[0];
    }
    lastWasZero = false;
    if (d === 1 && i === 2) {
      out += `${HANJA[1]}拾`;
    } else {
      out += HANJA[d] + u;
    }
  }
  return out.replace(new RegExp(`${HANJA[0]}+$`), "");
}

function integerToHanja(n: bigint): string {
  if (n === 0n) return HANJA[0];
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
      result += HANJA[0];
    }
    result += inner + gname;
  }
  result = result.replace(new RegExp(`${HANJA[0]}+`, "g"), HANJA[0]);
  result = result.replace(new RegExp(`^${HANJA[0]}`), "");
  result = result.replace(new RegExp(`${HANJA[0]}$`), "");
  return result || HANJA[0];
}

/** Hangul reading + formal Hanja in parentheses. */
export function convertKoreanCheque(
  major: bigint,
  minor: bigint,
  minorDigits: number,
): string {
  const hanjaInt = integerToHanja(major);
  if (minor === 0n || minorDigits === 0) {
    return `${toCardinal(major)}원 (${hanjaInt}圓)`;
  }
  return `${toCardinal(major)}원 ${toCardinal(minor)}전 (${hanjaInt}圓 ${integerToHanja(minor)}分)`;
}
