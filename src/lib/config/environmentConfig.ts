// تنظیمات محیط برای پروژه Peyk Khorshid
// این فایل تنظیمات مختلف محیط را مدیریت می‌کند

export const environmentConfig = {
  development: {
    apiUrl: import.meta.env.VITE_API_URL,
    appName: 'Peyk Khorshid',
    version: '1.0.0',
    debug: true,
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL,
    appName: 'Peyk Khorshid',
    version: '1.0.0',
    debug: false,
  },
};

// تشخیص محیط فعلی
export function getCurrentEnvironment(): 'development' | 'production' {
  // اولویت با متغیر محیطی Vite
  if (import.meta.env.VITE_APP_ENV) {
    return import.meta.env.VITE_APP_ENV as 'development' | 'production';
  }
  
  // تشخیص بر اساس mode در Vite
  if (import.meta.env.MODE === 'development') {
    return 'development';
  }
  
  if (import.meta.env.MODE === 'production') {
    return 'production';
  }
  
  // تشخیص بر اساس hostname
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname === '::1';
  
  return isLocalhost ? 'development' : 'production';
}

// دریافت تنظیمات محیط فعلی
export function getEnvironmentConfig() {
  const env = getCurrentEnvironment();
  return environmentConfig[env];
}

// دریافت URL API
export function getApiUrl(endpoint: string = ''): string {
  const config = getEnvironmentConfig();
  const baseUrl = import.meta.env.VITE_API_URL || config.apiUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}${cleanEndpoint ? `/${cleanEndpoint}` : ''}`;
}

export default environmentConfig;
