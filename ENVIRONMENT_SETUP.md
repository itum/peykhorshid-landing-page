# تنظیمات محیط پروژه Peyk Khorshid

این پروژه از سیستم مدیریت محیط پیشرفته استفاده می‌کند که امکان تغییر آسان بین محیط توسعه و تولید را فراهم می‌کند.

## نحوه استفاده

### 1. اجرای محیط توسعه
```bash
npm run dev
# یا
npm run start
```

### 2. ساخت برای محیط تولید
```bash
npm run build
```

### 3. ساخت برای محیط توسعه
```bash
npm run build:dev
```

## تنظیمات محیط

### متغیرهای محیطی پشتیبانی شده

- `VITE_API_URL`: آدرس API سرور
- `VITE_APP_ENV`: نوع محیط (development/production)
- `VITE_APP_NAME`: نام اپلیکیشن
- `VITE_APP_VERSION`: نسخه اپلیکیشن

### تنظیمات پیش‌فرض

#### محیط توسعه
- API URL: `http://localhost:3001`
- Debug: فعال
- Console logs: فعال

#### محیط تولید
- API URL: `https://ghesti.peykkhorshid.ir`
- Debug: غیرفعال
- Console logs: غیرفعال

## فایل‌های تنظیمات

- `src/lib/config/environment.ts`: تنظیمات اصلی محیط
- `src/lib/config/environmentConfig.ts`: تنظیمات تفصیلی محیط‌ها

## سرویس‌های به‌روزرسانی شده

تمام سرویس‌های زیر به‌روزرسانی شده‌اند تا از سیستم مدیریت محیط استفاده کنند:

- `apiClient.ts`
- `userService.ts`
- `contactService.ts`
- `contentService.ts`
- `statsService.ts`
- `uploadService.ts`

## نحوه تشخیص محیط

سیستم به ترتیب اولویت زیر محیط را تشخیص می‌دهد:

1. متغیر محیطی `VITE_APP_ENV`
2. متغیر محیطی `VITE_MODE`
3. تشخیص بر اساس hostname (localhost = development)

## مثال استفاده

```typescript
import { getApiUrl, isDevelopment } from '@/lib/config/environment';

// دریافت URL API
const apiUrl = getApiUrl('api/users');

// بررسی محیط
if (isDevelopment()) {
  console.log('در حال اجرا در محیط توسعه');
}
```
