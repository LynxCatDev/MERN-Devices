export const setDataToStorage = <T>(storageKey: string, data: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const getDataFromStorage = <T>(storageKey: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
};
