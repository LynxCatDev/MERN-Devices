import axios from 'axios';
import { axiosClassic, axiosWithAuth } from './interceptors';
import {
  AuthProps,
  CategoriesProps,
  CollectionProps,
  DevicesDataProps,
  DevicesProps,
  FoundDevices,
  SlidesProps,
} from '@/store/store.interface';

// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
// const refreshToken = getRefreshToken();
// const config = {
//   headers: { Authorization: `Bearer ${refreshToken}` },
//   withCredentials: true
// };

export const fetchSlides = async (): Promise<SlidesProps[]> => {
  const response = await axiosClassic.get('/sliders');

  // if (response.status !== 200) {
  //   throw new Error(`${response.data.message}`);
  // }

  return response.data;
};

export const fetchDevices = async (
  q?: string,
  category?: string,
  sort?: string,
  limit?: number,
  page?: number,
): Promise<DevicesDataProps> => {
  try {
    const response = await axiosClassic.get('/devices', {
      // ...(category ? { params: { category } } : {}),
      params: { q, category, sort, limit, page },
    });

    if (response.status !== 200) {
      throw new Error(`${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchDevice = async (link: string): Promise<DevicesProps> => {
  try {
    const response = await axiosClassic.get(`/devices/${link}`);

    if (response.status !== 200) {
      throw new Error(`${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const searchDevices = async (name: string): Promise<FoundDevices[]> => {
  try {
    const response = await axiosClassic.get(`/devices/search/${name}`);

    if (response.status !== 200) {
      throw new Error(`${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchCategories = async (): Promise<CategoriesProps[]> => {
  try {
    const response = await axiosClassic.get('/categories');

    if (response.status !== 200) {
      throw new Error(`${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchCollection = async (): Promise<CollectionProps[]> => {
  try {
    const response = await axiosClassic.get('/collection');

    if (response.status !== 200) {
      throw new Error(`${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const userRegistration = async (auth: AuthProps) => {
  try {
    const response = await axiosClassic.post('/users/auth/registration', {
      first_name: auth.first_name,
      last_name: auth.last_name,
      email: auth.email,
      password: auth.password,
      role: auth.role,
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axiosClassic.post('/users/auth/login', {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const validateSession = async (refreshToken: string) => {
  try {
    const response = await axiosClassic.post('/users/auth/validate-user', {
      refreshToken,
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const addToFavorites = async (id: number) => {
  try {
    const response = await axiosWithAuth.post(`/users/favorites/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getUserFavorites = async (page: number) => {
  try {
    const response = await axiosWithAuth.get('/users/favorites', {
      params: { page },
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
