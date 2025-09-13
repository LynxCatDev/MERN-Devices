import Cookies from 'js-cookie';
import { axiosWithAuth } from './interceptors';

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken',
}

// Note: Refresh token is now handled by httpOnly cookies on the server
// We only need to manage the access token on the client side

export const getAccessToken = async (): Promise<string | null> => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);

  // Check if token is expired and try to refresh
  if (accessToken && isTokenExpired(accessToken)) {
    console.log('Access token expired, attempting refresh...');
    Cookies.remove(EnumTokens.ACCESS_TOKEN);

    // Try to refresh using stored refresh token
    const newAccessToken = await refreshTokens();
    return newAccessToken;
  }

  return accessToken || null;
};

export const setAccessToken = (accessToken: string) => {
  // Calculate expiration from JWT token and set cookie accordingly
  const expirationTime = getTokenExpiration(accessToken);

  if (expirationTime) {
    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
      expires: new Date(expirationTime * 1000), // Convert to milliseconds
      sameSite: 'strict',
    });
  } else {
    // Fallback: set for 15 minutes if we can't parse expiration
    Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      sameSite: 'strict',
    });
  }
};

export const setRefreshToken = (refreshToken: string) => {
  // Calculate expiration from JWT token and set cookie accordingly
  const expirationTime = getTokenExpiration(refreshToken);

  if (expirationTime) {
    Cookies.set(EnumTokens.REFRESH_TOKEN, refreshToken, {
      expires: new Date(expirationTime * 1000), // Convert to milliseconds
      sameSite: 'strict',
    });
  } else {
    // Fallback: set for 7 days if we can't parse expiration
    Cookies.set(EnumTokens.REFRESH_TOKEN, refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'strict',
    });
  }
};

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Helper function to get token expiration time
const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    console.error('Error parsing token expiration:', error);
    return null;
  }
};

export const removeFromStorage = () => {
  Cookies.remove(EnumTokens.ACCESS_TOKEN);
  Cookies.remove(EnumTokens.REFRESH_TOKEN);
};

export const getRefreshToken = () => {
  return Cookies.get(EnumTokens.REFRESH_TOKEN) || null;
};

// Function to refresh both access and refresh tokens
export const refreshTokens = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    const response = await axiosWithAuth.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/refresh`,
      { refreshToken },
      { withCredentials: true },
    );

    if (response.status === 200) {
      if (response.data.accessToken && response.data.refreshToken) {
        // Store both new tokens
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        console.log('Tokens refreshed successfully');
        return response.data.accessToken;
      }
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

  return null;
};
