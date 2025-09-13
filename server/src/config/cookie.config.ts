export const getCookieConfig = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800000'), // 7 days default
  path: '/',
  domain: process.env.COOKIE_DOMAIN || undefined,
});
