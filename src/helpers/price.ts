/**
 * Price helpers: parse LiteCart money strings and format expected totals.
 * Regex usage is intentional for the assignment requirements.
 */
export function parseMoney(value: string): number {
  // "$1,234.56" / "$1.234,56" / "$60" → number
  const normalized = value.replace(/\s/g, '');
  const match = normalized.match(/-?\$?\s*(-?[\d.,]+)/);
  if (!match) {
    throw new Error(`Unable to parse money from: "${value}"`);
  }

  let amount = match[1];
  const hasDot = amount.includes('.');
  const hasComma = amount.includes(',');

  if (hasDot && hasComma) {
    // Last separator is decimal: 1,234.56 or 1.234,56
    if (amount.lastIndexOf(',') > amount.lastIndexOf('.')) {
      amount = amount.replace(/\./g, '').replace(',', '.');
    } else {
      amount = amount.replace(/,/g, '');
    }
  } else if (hasComma) {
    // LiteCart uses "60,00" as decimal comma for some locales
    amount = amount.replace(',', '.');
  }

  const parsed = Number(amount);
  if (Number.isNaN(parsed)) {
    throw new Error(`Unable to parse money from: "${value}"`);
  }
  return parsed;
}

export function formatUsdFixed(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Cart widget pattern: "3 item(s) - $60" */
export const cartWidgetPattern = /(\d+)\s+item\(s\)\s+-\s+(\$[\d.,]+)/i;

/** Login success notice pattern */
export const loggedInPattern = /You are now logged in as\s+.+/i;

/** Invalid credentials notice pattern */
export const wrongCredentialsPattern =
  /Wrong password or the account is disabled,? or does not exist/i;

/** Order success heading pattern */
export const orderSuccessPattern = /Your order is successfully completed!/i;
