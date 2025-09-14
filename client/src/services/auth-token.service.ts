import Cookies from 'js-cookie';
import { axiosWithAuth } from './interceptors';
import { useUser } from '@/store/store';

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken',
}

export const getAccessToken = () => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
  return accessToken || null;
};

export const setAccessToken = (accessToken: string) => {
  Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken);
};

// Helper function to check if JWT token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

export const removeFromStorage = () => {
  Cookies.remove(EnumTokens.ACCESS_TOKEN);
};

// Note: Refresh token is httpOnly cookie, cannot be get via JS
export const getRefreshToken = () => {
  return Cookies.get(EnumTokens.REFRESH_TOKEN) || null;
};

// Function to refresh both access and refresh tokens
export const refreshTokens = async (): Promise<string | null> => {
  try {
    const response = await axiosWithAuth.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/refresh`,
      {},
      { withCredentials: true },
    );

    if (response.status === 200) {
      setAccessToken(response.data.accessToken);
      useUser.setState({
        profile: { user: response.data.user },
        activeFavoritesIds: response.data.user?.activeFavoritesIds,
        error: null,
        loading: false,
      });
      return response.data.accessToken;
    } else {
      console.log('Failed to refresh tokens, user needs to login again');
      removeFromStorage();
      return null;
    }
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    removeFromStorage();
    return null;
  }
};
