function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and set credentials.`,
    );
  }
  return value;
}

/** Test credentials from .env (see .env.example). */
export const credentials = {
  valid: {
    get email() {
      return requiredEnv('TEST_USER_EMAIL');
    },
    get password() {
      return requiredEnv('TEST_USER_PASSWORD');
    },
  },
  invalid: {
    get email() {
      return requiredEnv('TEST_USER_EMAIL');
    },
    get password() {
      return requiredEnv('TEST_INVALID_PASSWORD');
    },
  },
};

export const products = {
  /** Regular price product without campaign sticker. */
  withoutDiscount: {
    name: 'Blue Duck',
    path: 'rubber-ducks-c-1/blue-duck-p-4',
    productId: 4,
    unitPrice: 20,
    sku: 'RD004',
  },
  /** Campaign product; Small size keeps base campaign price. */
  withDiscount: {
    name: 'Yellow Duck',
    path: 'rubber-ducks-c-1/subcategory-c-2/yellow-duck-p-1',
    productId: 1,
    regularPrice: 20,
    campaignPrice: 18,
    size: 'Small',
    sku: 'RD001-S',
  },
  secondGuestProduct: {
    name: 'Red Duck',
    path: 'rubber-ducks-c-1/red-duck-p-3',
    productId: 3,
    unitPrice: 20,
    sku: 'RD003',
  },
} as const;

export const quantities = {
  withoutDiscount: 3,
  withDiscount: 2,
} as const;
