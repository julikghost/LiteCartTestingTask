function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env and set credentials.`);
  }
  return value;
}

export const credentials = {
  valid: {
    get email() {
      return requiredEnv('TEST_USER_EMAIL');
    },
    get password() {
      return requiredEnv('TEST_USER_PASSWORD');
    },
  },
  wrongPassword: {
    get email() {
      return requiredEnv('TEST_USER_EMAIL');
    },
    get password() {
      return requiredEnv('TEST_INVALID_PASSWORD');
    },
  },
};

export const products = {
  withoutDiscount: {
    name: 'Blue Duck',
    path: 'rubber-ducks-c-1/blue-duck-p-4',
    unitPrice: 20,
  },
  withDiscount: {
    name: 'Yellow Duck',
    path: 'rubber-ducks-c-1/subcategory-c-2/yellow-duck-p-1',
    regularPrice: 20,
    campaignPrice: 18,
    size: 'Small',
  },
  secondGuestProduct: {
    name: 'Red Duck',
    path: 'rubber-ducks-c-1/red-duck-p-3',
    unitPrice: 20,
  },
} as const;

export const quantities = {
  withoutDiscount: 3,
  withDiscount: 2,
} as const;
