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
  CompareStore,
  DevicesProps,
  DevicesStore,
  SlidesStore,
  ThemeStore,
  UserFavoritesResponse,
  UserResponse,
  UserStore,
} from './store.interface';
import { AxiosError } from 'axios';
import { MAX_COMPARE_DEVICES } from '@/constants/compare';

export const useSlider = create<SlidesStore>()(
  persist(
    (set) => ({
      slides: [] as SlidesStore['slides'],
      loading: true,
      error: null as SlidesStore['error'],
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
    }),
    {
      name: 'slides',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        slides: state.slides,
      }),
      // Skip hydration on server
      skipHydration: true,
    },
  ),
);

export const useCategories = create<CategoriesStore>()(
  persist(
    (set) => ({
      categories: [] as CategoriesStore['categories'],
      loading: true as boolean,
      error: null as CategoriesStore['error'],
      getCategories: async () => {
        try {
          const response: CategoriesStore['categories'] =
            await fetchCategories();
          set({ categories: response });
        } catch (error) {
          const typedError = error as Error;
          set({ error: typedError.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'categories',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
      }),
      // Skip hydration on server
      skipHydration: true,
    },
  ),
);

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
      // Skip hydration on server to prevent mismatch
      skipHydration: true,
    },
  ),
);

export const useDevices = create<DevicesStore>()(
  persist(
    (set) => ({
      devices: null as DevicesStore['devices'],
      foundDevices: [] as DevicesStore['foundDevices'],
      loading: true,
      loadingFoundDevices: true,
      error: null as DevicesStore['error'],
      errorFoundDevices: null as DevicesStore['errorFoundDevices'],
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
    }),
    {
      name: 'devices',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        devices: state.devices,
      }),
      // Skip hydration on server
      skipHydration: true,
    },
  ),
);

export const useUser = create<UserStore>()((set) => ({
  profile: null as UserStore['profile'],
  userFavorites: null as UserStore['userFavorites'],
  activeFavoritesIds: null as UserStore['activeFavoritesIds'],
  loading: true,
  error: null as UserStore['error'],
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
      const typedError = error as AxiosError<{ message?: string }>;
      set({
        error: typedError.response?.data?.message || typedError.message,
      });
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
      const typedError = error as AxiosError<{ message?: string }>;
      set({
        error: typedError.response?.data?.message || typedError.message,
      });
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
    set({ profile: null, activeFavoritesIds: [] });
    removeFromStorage();
    await userLogOut();
    if (typeof window !== 'undefined') {
      const { pathname } = window.location;
      // Detect locale from the first path segment
      const isAlreadyHome =
        pathname === '/' ||
        pathname === '/en' ||
        pathname === '/ro' ||
        pathname === '/ru';

      // Only redirect if not already on the (locale) home page
      if (!isAlreadyHome) {
        window.location.replace('/');
      }
    }
  },
  addToFavorites: async (id: number) => {
    try {
      const response: UserResponse<DevicesProps> = await addToFavorites(id);
      if (response.status !== 200) {
        const message = response?.response?.data?.message;
        throw new Error(`${message}`);
      }

      const responseFavoriteId = Number(response?.data?.id);

      set((state) => {
        const existingFavorites = state.userFavorites?.data || [];
        const isFavoriteActive = existingFavorites.some(
          (favorite) => favorite.id === responseFavoriteId,
        );

        const nextFavorites = isFavoriteActive
          ? existingFavorites.filter(
              (favorite) => favorite.id !== responseFavoriteId,
            )
          : [...existingFavorites, response.data];

        const currentActiveFavoriteIds = state.activeFavoritesIds || [];
        const nextFavoriteIds = currentActiveFavoriteIds.includes(
          responseFavoriteId,
        )
          ? currentActiveFavoriteIds.filter(
              (favoriteId) => favoriteId !== responseFavoriteId,
            )
          : [...currentActiveFavoriteIds, responseFavoriteId];

        return {
          userFavorites: state.userFavorites
            ? {
                ...state.userFavorites,
                data: nextFavorites,
              }
            : state.userFavorites,
          activeFavoritesIds: nextFavoriteIds,
        };
      });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    }
  },
  getUserFavorites: async (page: number) => {
    try {
      const response: UserResponse<UserFavoritesResponse> =
        await getUserFavorites(page);
      if (response.status !== 200) {
        const message = response?.response?.data?.message;
        throw new Error(`${message}`);
      }
      set({ userFavorites: response.data?.favorites });
    } catch (error) {
      const typedError = error as Error;
      set({ error: typedError.message });
    }
  },
}));

export const useCompare = create<CompareStore>()(
  persist(
    (set) => ({
      compareDevices: [] as CompareStore['compareDevices'],
      toggleCompare: (device: DevicesProps) => {
        set((state) => {
          const isAlreadyCompared = state.compareDevices.some(
            (compareDevice) => compareDevice.id === device.id,
          );

          if (isAlreadyCompared) {
            return {
              compareDevices: state.compareDevices.filter(
                (compareDevice) => compareDevice.id !== device.id,
              ),
            };
          }

          if (state.compareDevices.length >= MAX_COMPARE_DEVICES) {
            return {
              compareDevices: state.compareDevices,
            };
          }

          return {
            compareDevices: [...state.compareDevices, device],
          };
        });
      },
      removeFromCompare: (id: number) => {
        set((state) => ({
          compareDevices: state.compareDevices.filter(
            (compareDevice) => compareDevice.id !== id,
          ),
        }));
      },
      clearCompare: () => {
        set({ compareDevices: [] });
      },
    }),
    {
      name: 'compare-devices',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        compareDevices: state.compareDevices,
      }),
      skipHydration: true,
    },
  ),
);
