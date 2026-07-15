/**
 * Price helpers: parse LiteCart money strings and format expected totals.
 * Regex usage is intentional for the assignment requirements.
 */
export function parseMoney(value: string): number {
  const match = value.replace(/\s/g, '').match(/-?\$?\s*(-?\d+(?:[.,]\d+)?)/);
  if (!match) {
    throw new Error(`Unable to parse money from: "${value}"`);
  }
  return Number(match[1].replace(',', '.'));
}

export function formatUsd(amount: number): string {
  return `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;
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
