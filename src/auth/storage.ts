/** Path to saved logged-in browser cookies/localStorage (created by auth.setup.ts). */
export const AUTH_STORAGE_PATH = '.auth/user.json';

/** Fresh session without cookies — for auth UI tests and guest checkout. */
export const EMPTY_STORAGE_STATE = {
  cookies: [],
  origins: [],
};
