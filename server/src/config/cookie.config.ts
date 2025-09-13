export const getCookieConfig = () => ({
  httpOnly: false, // Changed to false for cross-domain compatibility
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' as const,
  maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800000'), // 7 days default
  path: '/',
  // domain: process.env.COOKIE_DOMAIN || undefined,
});
