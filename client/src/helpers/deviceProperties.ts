import { DevicesProps } from '@/store/store.interface';

type TranslateFunction = (key: string) => string;

const MATERIAL_PROPERTIES = ['material', 'rimMaterial', 'frameMaterial'];
const ARRAY_PROPERTIES = ['audioFormats', 'interface', 'memoryCard'];

const safeTranslate = (value: string, t: TranslateFunction) => {
  try {
    return t(value);
  } catch {
    return value;
  }
};

const normalizeValue = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
};

export const hasDevicePropertyValue = (
  device: DevicesProps,
  property: string,
): boolean => {
  const value = normalizeValue(device?.[property]);

  if (typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== '';
};

export const formatDevicePropertyValue = (
  device: DevicesProps,
  property: string,
  t: TranslateFunction,
): string => {
  const value = normalizeValue(device?.[property]);

  if (value === undefined || value === null || value === '') {
    return '-';
  }

  if (property === 'camera' || property === 'frontCamera') {
    return `${value} mpx`;
  }

  if (property === 'resolution') {
    return `${value} px`;
  }

  if (
    property === 'memory' ||
    property === 'hardDrive' ||
    property === 'videoCardMemory'
  ) {
    return `${value} GB`;
  }

  if (property === 'weight') {
    const numericWeight = Number(value);
    if (!Number.isNaN(numericWeight) && numericWeight >= 1000) {
      return `${(numericWeight * 0.001).toFixed(1)} ${t('kilogram')}`;
    }

    return `${value} ${t('gram')}`;
  }

  if (property === 'supportedWeight') {
    return `${value} ${t('kilogram')}`;
  }

  if (
    property === 'touchScreen' ||
    property === 'microphone' ||
    property === 'coldAir'
  ) {
    return value ? t('true') : t('false');
  }

  if (property === 'chargingTime' || property === 'workingTimeHours') {
    return `${value} ${t('hours')}`;
  }

  if (property === 'workingTimeDays') {
    return `${value} ${t('days')}`;
  }

  if (property === 'batteryCapacity') {
    return `${value} mAh`;
  }

  if (ARRAY_PROPERTIES.includes(property) && Array.isArray(value)) {
    return value.join(', ');
  }

  if (property === 'maxSpeed') {
    return `${value} km/h`;
  }

  if (property === 'electricRange') {
    return `${value} km`;
  }

  if (property === 'sensitivity') {
    return `${value} dB`;
  }

  if (property === 'impedance' || property === 'impendance') {
    return `${value} Ohm`;
  }

  if (property === 'wheelDiameter' || property === 'frameDiameter') {
    return `${value}"`;
  }

  if (MATERIAL_PROPERTIES.includes(property)) {
    if (Array.isArray(value)) {
      return value
        .map((materialValue) =>
          safeTranslate(String(materialValue).toLowerCase(), t),
        )
        .join(', ');
    }

    return safeTranslate(String(value).toLowerCase(), t);
  }

  return String(value);
};
