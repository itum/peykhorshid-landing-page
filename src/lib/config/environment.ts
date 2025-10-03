// تنظیمات محیط برای پروژه Peyk Khorshid
import { getEnvironmentConfig, getApiUrl as getApiUrlFromConfig } from './environmentConfig';

export const config = {
  // تشخیص محیط بر اساس متغیرهای محیطی
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // URL های API
  apiUrl: import.meta.env.VITE_API_URL || getEnvironmentConfig().apiUrl,
  
  // تنظیمات اپلیکیشن
  appName: import.meta.env.VITE_APP_NAME || getEnvironmentConfig().appName,
  appVersion: import.meta.env.VITE_APP_VERSION || getEnvironmentConfig().version,
  
  // تنظیمات اضافی
  timeout: 10000,
  retryAttempts: 3,
};

// تابع کمکی برای دریافت URL کامل API
export function getApiUrl(endpoint: string = ''): string {
  return getApiUrlFromConfig(endpoint);
}

// تابع کمکی برای تشخیص محیط
export function isDevelopment(): boolean {
  return config.isDevelopment;
}

export function isProduction(): boolean {
  return config.isProduction;
}

export default config;
