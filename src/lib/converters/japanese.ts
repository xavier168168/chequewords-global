const DAIJI = ["零", "壱", "弐", "参", "四", "五", "六", "七", "八", "九"] as const;
const UNITS = ["阡", "百", "拾", ""];
const GROUPS = ["", "万", "億", "兆"];

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
      out += DAIJI[0];
    }
    lastWasZero = false;
    if (d === 1 && i === 2) {
      out += `${DAIJI[1]}拾`;
    } else {
      out += DAIJI[d] + u;
    }
  }
  return out.replace(new RegExp(`${DAIJI[0]}+$`), "");
}

function integerToDaiji(n: bigint): string {
  if (n === 0n) return DAIJI[0];
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
      result += DAIJI[0];
    }
    result += inner + gname;
  }
  result = result.replace(new RegExp(`${DAIJI[0]}+`, "g"), DAIJI[0]);
  result = result.replace(new RegExp(`^${DAIJI[0]}`), "");
  result = result.replace(new RegExp(`${DAIJI[0]}$`), "");
  return result || DAIJI[0];
}

/**
 * Formal 大字 amount. Integer-only: `金…円也`.
 * With fractional subunits: `金…円、…銭也` (subunit treated as 1/100 main unit).
 */
export function convertJapaneseCheque(
  major: bigint,
  minor: bigint,
  minorDigits: number,
): string {
  if (minorDigits === 0 || minor === 0n) {
    return `金${integerToDaiji(major)}円也`;
  }
  return `金${integerToDaiji(major)}円、${integerToDaiji(minor)}銭也`;
}
