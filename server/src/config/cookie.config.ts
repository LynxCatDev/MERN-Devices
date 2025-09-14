export const getCookieConfig = () => ({
  httpOnly: true, // Keep as httpOnly for security
  secure: process.env.NODE_ENV === 'production' ? true : false,
  sameSite:
    process.env.NODE_ENV === 'production'
      ? ('none' as const)
      : ('lax' as const),
  maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800000'), // 7 days default
  path: '/',
  // domain: process.env.COOKIE_DOMAIN || undefined,
});
