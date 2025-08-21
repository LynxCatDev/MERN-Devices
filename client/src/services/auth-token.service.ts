import Cookies from 'js-cookie';

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken',
}

export const getRefreshToken = () => {
  const refreshToken = Cookies.get(EnumTokens.REFRESH_TOKEN);
  return refreshToken || null;
};

export const saveTokenStorage = (refreshToken: string) => {
  Cookies.set(EnumTokens.REFRESH_TOKEN, refreshToken, {
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeFromStorage = () => {
  Cookies.remove(EnumTokens.REFRESH_TOKEN);
};
