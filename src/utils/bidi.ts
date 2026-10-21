/**
 * Bidi and Persian language helper utilities
 */

const RTL_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LTR_REGEX = /[A-Za-z]/;

/**
 * Auto-detects text direction (RTL or LTR) based on leading or majority characters
 */
export function detectDirection(text: string): 'rtl' | 'ltr' {
  if (!text || text.trim() === '') return 'rtl';

  // Check first non-whitespace 100 characters for dominant script
  const sample = text.trim().slice(0, 300);
  let rtlCount = 0;
  let ltrCount = 0;

  for (const char of sample) {
    if (RTL_REGEX.test(char)) rtlCount++;
    else if (LTR_REGEX.test(char)) ltrCount++;
  }

  if (rtlCount >= ltrCount && rtlCount > 0) return 'rtl';
  if (ltrCount > rtlCount) return 'ltr';

  // Default to RTL if Persian editor
  return 'rtl';
}

/**
 * Converts English digits to Persian digits (e.g. 123 -> ۱۲۳)
 */
export function toPersianDigits(val: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

/**
 * Computes reading time estimate based on 200 words per minute
 */
export function estimateReadingTime(text: string, isPersian = true): { minutes: number; label: string } {
  const words = countWords(text);
  const minutes = Math.max(1, Math.ceil(words / 200));

  if (isPersian) {
    return {
      minutes,
      label: `زمان مطالعه: حدود ${toPersianDigits(minutes)} دقیقه`,
    };
  }
  return {
    minutes,
    label: `Est. reading time: ~${minutes} min`,
  };
}

/**
 * Word and character counter supporting Persian and English text
 */
export function countWords(text: string): number {
  if (!text) return 0;
  // Match Persian and Latin words separated by spaces or punctuation
  const matches = text.trim().match(/[\p{L}\p{N}]+/gu);
  return matches ? matches.length : 0;
}

export function countCharacters(text: string): { total: number; noSpaces: number } {
  if (!text) return { total: 0, noSpaces: 0 };
  const total = text.length;
  const noSpaces = text.replace(/\s/g, '').length;
  return { total, noSpaces };
}
