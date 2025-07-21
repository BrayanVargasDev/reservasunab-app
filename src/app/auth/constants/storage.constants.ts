export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LAST_ACTIVITY: 'last_activity',
} as const;

export const AUTH_CONFIG = {
  TOKEN_CHECK_TIMEOUT: 5000,
  GUARD_TIMEOUT: 3000,
  CACHE_DURATION: 1000 * 60 * 5,
} as const;
