import {
  addToFavorites,
  fetchCategories,
  fetchDevices,
  fetchSlides,
  getUserFavorites,
  searchDevices,
  userLogin,
  userLogOut,
  userRegistration,
  validateSession,
} from '@/services/api';
import {
  removeFromStorage,
  setAccessToken,
} from '@/services/auth-token.service';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  AuthProps,
  CategoriesStore,
  DevicesProps,
  DevicesStore,
  SlidesStore,
  ThemeStore,
  UserResponse,
  UserStore,
} from './store.interface';

export const useSlider = create<SlidesStore>((set) => ({
  slides: [],
  loading: true,
  error: null,
  getSlides: async () => {
    try {
      const response = await fetchSlides();
      set({ slides: response });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useCategories = create<CategoriesStore>((set) => ({
  categories: [],
  loading: true,
  error: null,
  getCategories: async () => {
    try {
      const response = await fetchCategories();
      set({ categories: response });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' });
      },
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useDevices = create<DevicesStore>((set) => ({
  devices: null,
  foundDevices: [],
  loading: true,
  loadingFoundDevices: true,
  error: null,
  errorFoundDevices: null,
  getDevices: async (
    q?: string,
    category?: string,
    sort?: string,
    limit?: number,
    page?: number,
  ) => {
    try {
      const response = await fetchDevices(q, category, sort, limit, page);
      set({ devices: response });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    } finally {
      set({ loading: false });
    }
  },
  searchDevices: async (query: string) => {
    set({ loadingFoundDevices: true });
    try {
      const response = await searchDevices(query);
      set({ foundDevices: response });
    } catch (error) {
      const typedError = error as Error;
      set({ errorFoundDevices: typedError.message });
    } finally {
      set({ loadingFoundDevices: false });
    }
  },
}));

export const useUser = create<UserStore>((set) => ({
  profile: null,
  userFavorites: null,
  activeFavoritesIds: null,
  loading: true,
  error: null,
  registration: async (auth: AuthProps) => {
    try {
      const response = await userRegistration(auth);

      if (response.status !== 200) {
        const message = response.data.message || response.data.error;
        throw new Error(`${message}`);
      }

      // Store access token from response (refresh token handled by server cookies)
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }

      set({ profile: response.data });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await userLogin(email, password);

      if (response.status !== 200) {
        const message = response.data.message || response.data.error;
        throw new Error(`${message}`);
      }

      // Store access token from response (refresh token handled by server cookies)
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }

      set({ profile: response.data });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    }
  },
  validateSession: async () => {
    try {
      const response = await validateSession();

      if (response.status !== 200) {
        const message = response.data.message || response.data.error;
        throw new Error(`${message}`);
      }

      // Only store access token from response (refresh token is httpOnly)
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }

      set({
        profile: { user: response.data.user },
        activeFavoritesIds: response.data.user.activeFavoritesIds,
        error: null,
      });
    } catch (error) {
      const typedError = error as Error;

      // Don't set error state for expected authentication failures
      const isExpectedAuthError =
        typedError.message === 'No refresh token provided' ||
        typedError.message === 'Invalid refresh token' ||
        typedError.message.includes('401');

      if (!isExpectedAuthError) {
        set({ error: typedError.message });
      } else {
        // Clear any existing profile on auth failure
        set({ profile: null, error: null });
      }
    } finally {
      set({ loading: false });
    }
  },
  userLogOut: async () => {
    set({ profile: null });
    removeFromStorage();
    await userLogOut();
    window.location.replace('/');
  },
  addToFavorites: async (id: number) => {
    try {
      const response: UserResponse = await addToFavorites(id);
      if (response.status !== 200) {
        const message = response?.response?.data?.message;
        throw new Error(`${message}`);
      }

      const responseFavoriteId = Number(response?.data?.id);

      const checkFavorites = (favorites: DevicesProps[]) => {
        if (favorites?.length > 0) {
          const newFavorites = [...favorites, response.data];
          if (
            favorites?.find((favorite) => favorite.id === responseFavoriteId)
          ) {
            const filteredFavorites = favorites?.filter(
              (favorite) => favorite.id !== responseFavoriteId,
            );
            return filteredFavorites;
          } else {
            return newFavorites;
          }
        }
      };

      const checkFavoritesIds = (activeFavoritesIds: number[]) => {
        const newFavoritesIds = [...activeFavoritesIds, responseFavoriteId];
        if (
          activeFavoritesIds?.find(
            (favoriteId) => favoriteId === responseFavoriteId,
          )
        ) {
          const filteredFavoritesIds = activeFavoritesIds?.filter(
            (favoriteId) => favoriteId !== responseFavoriteId,
          );
          return filteredFavoritesIds;
        } else {
          return newFavoritesIds;
        }
      };

      set((state: any) => ({
        userFavorites: {
          ...state?.userFavorites,
          data: checkFavorites(state?.userFavorites?.data),
        },
        activeFavoritesIds: checkFavoritesIds(state.activeFavoritesIds),
      }));
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    }
  },
  getUserFavorites: async (page: number) => {
    try {
      const response: UserResponse = await getUserFavorites(page);
      if (response.status !== 200) {
        const message = response?.response?.data?.message;
        throw new Error(`${message}`);
      }
      set({ userFavorites: response.data.favorites });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    }
  },
}));
