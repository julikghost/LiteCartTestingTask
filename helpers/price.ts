export function parseMoney(value: string): number {
  const normalized = value.replace(/\s/g, '');
  const match = normalized.match(/-?\$?\s*(-?[\d.,]+)/);
  if (!match) {
    throw new Error(`Unable to parse money from: "${value}"`);
  }

  let amount = match[1];
  const hasDot = amount.includes('.');
  const hasComma = amount.includes(',');

  if (hasDot && hasComma) {
    if (amount.lastIndexOf(',') > amount.lastIndexOf('.')) {
      amount = amount.replace(/\./g, '').replace(',', '.');
    } else {
      amount = amount.replace(/,/g, '');
    }
  } else if (hasComma) {
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

export const cartWidgetPattern = /(\d+)\s+item\(s\)\s+-\s+(\$[\d.,]+)/i;

export const loggedInPattern = /You are now logged in as\s+.+/i;

export const wrongCredentialsPattern =
  /Wrong password or the account is disabled,? or does not exist/i;

export const orderSuccessPattern = /Your order is successfully completed!/i;
