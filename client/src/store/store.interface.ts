export interface SlidesProps {
  id: number;
  imgUrl: string;
  link: string;
  altName: string;
}

export interface SlidesStore {
  slides: SlidesProps[];
  loading: boolean;
  error: string | null;
  getSlides: () => Promise<void>;
}

export interface CategoriesProps {
  id: number;
  link: string;
  name: string;
  imgUrl: string;
  shadowColor: string;
  translate: string;
}

export interface CategoriesStore {
  categories: CategoriesProps[];
  loading: boolean;
  error: string | null;
  getCategories: () => Promise<void>;
}

export interface ThemeStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export interface DevicesProps {
  [key: string]: unknown;
  id: number;
  name: string;
  email?: string;
  price: number;
  credit?: number;
  cashback?: number;
  model: string;
  color: string;
  weight: number;
  popularity: number;
  manufacturer: string;
  category?: string;
  imageUrl: string;
  imageUrls?: string[];
  images?: string[];
  type: string;
  link: string;
  colors: string[];
  memoryOptions: number[];
  camera?: number;
  frontCamera?: number;
  chipset?: string;
  processor?: string;
  resolution?: string;
  displayFrequency?: string;
  hardDrive?: number;
  memory?: number;
  cores?: number;
  chipsetFrequency?: string;
  segment?: string;
  display?: string;
  displayType?: string;
  videoCard?: string;
  videoCardMemory?: string;
  touchScreen?: boolean;
  chargingTime?: number;
  workingTimeDays?: number;
  workingTimeHours?: number;
  batteryCapacity?: number;
  chargingCapacity?: string;
  bluetooth?: number;
  power?: number | string;
  workingDistance?: number;
  audioFrequency?: string;
  audioFormats?: string[];
  usbConnectors?: number;
  hdmi?: number;
  interface?: string[];
  material: string | string[];
  supportedWeight: number;
  maxSpeed: number;
  batteryType: string;
  errorRange: string;
  measurementLevel: string;
  sensitivity: number;
  impendance?: number;
  impedance?: number;
  connectionType: string;
  wireLength: number;
  microphone: boolean;
  coldAir: boolean;
  temperatureLevels: number;
  gears: number;
  dimensions: string;
  releaseDate: number;
  wheelDiameter: number;
  speedsNumber: number;
  brakeType: string;
  rimMaterial: string;
  frameMaterial: string;
  frameDiameter: number;
  memoryCard: string[];
  diaphragm: string;
  focalDistance: string;
  opticalZoom: number;
  refreshRate: string;
  electricRange?: number;
  functionalities?: string;
}

export interface DevicesDataProps {
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
  data: DevicesProps[];
}

export interface FoundDevices {
  id: number;
  name: string;
  link: string;
  imageUrl: string;
  price: number;
}

export interface DevicesStore {
  devices: DevicesDataProps | null;
  foundDevices: FoundDevices[];
  loading: boolean;
  loadingFoundDevices: boolean;
  error: string | null;
  errorFoundDevices: string | null;
  getDevices: (
    q?: string,
    category?: string,
    sort?: string,
    limit?: number,
    page?: number,
  ) => Promise<void>;
  searchDevices: (query: string) => Promise<void>;
}

export interface CollectionProps {
  id: number;
  name: string;
  translate: string;
  link: string;
  imgUrl: string;
}

export interface UserProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  favorites: DevicesDataProps;
  activeFavoritesIds?: number[];
}

export interface ValidateUserProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    favorites?: DevicesDataProps;
    activeFavoritesIds?: number[];
    isLoggedIn?: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

export interface UserStore {
  profile: ValidateUserProps | null;
  userFavorites?: DevicesDataProps | null;
  activeFavoritesIds?: number[] | null;
  loading: boolean;
  error: string | null;
  registration: (auth: AuthProps) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  validateSession: () => Promise<void>;
  userLogOut: () => Promise<void>;
  addToFavorites: (id: number) => Promise<void>;
  getUserFavorites: (page: number) => Promise<void>;
}

export interface CompareStore {
  compareDevices: DevicesProps[];
  toggleCompare: (device: DevicesProps) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
}

export interface AuthProps {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserResponse<T = UserProps> {
  data?: T;
  status?: number;
  response?: {
    data: {
      message: string;
    };
  };
}

export interface UserFavoritesResponse {
  favorites: DevicesDataProps;
}
