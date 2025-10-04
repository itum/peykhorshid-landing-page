# راهنمای تنظیم متغیرهای محیطی

⚠️ **مهم**: همه آدرس‌های هاردکد شده حذف شده‌اند. اکنون فقط از متغیرهای محیطی استفاده می‌شود.

## فایل .env برای Frontend (الزامی)

در ریشه پروژه فایل `.env` ایجاد کنید:

```bash
# تنظیمات محیط برای پروژه Peyk Khorshid
# آدرس API سرور - الزامی
VITE_API_URL=http://localhost:3001

# تنظیمات اضافی (اختیاری)
VITE_APP_NAME=Peyk Khorshid
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# تنظیمات SMS (اختیاری - برای ارسال پیامک)
VITE_KAVENEGAR_API_KEY=your_kavenegar_api_key
```

## فایل .env برای Server (الزامی)

در پوشه `server` فایل `.env` ایجاد کنید:

```bash
# تنظیمات محیط سرور Peyk Khorshid
# آدرس پایه سرور - الزامی برای آپلود و نمایش تصاویر
BASE_URL=http://localhost:3001

# تنظیمات دیتابیس - الزامی
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=peykkhorshid
DB_PORT=3306
DB_CONNECTION_LIMIT=10

# تنظیمات سرور
PORT=3001
NODE_ENV=development

# تنظیمات CORS (اختیاری)
CORS_ORIGIN=*

# تنظیمات آپلود فایل
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/images
```

## تغییر آدرس API

برای تغییر آدرس API، فقط متغیر `VITE_API_URL` را در فایل `.env` تغییر دهید:

### محیط توسعه
```bash
VITE_API_URL=http://localhost:3001
```

### محیط تولید
```bash
VITE_API_URL=https://your-api-domain.com
```

### محیط تست
```bash
VITE_API_URL=https://test-api-domain.com
```

## نکات مهم

1. **همه مسیرهای API** از `VITE_API_URL` استفاده می‌کنند
2. **آپلود و نمایش تصاویر** با `BASE_URL` در سرور تنظیم می‌شود
3. **تنظیمات دیتابیس** از متغیرهای محیطی خوانده می‌شوند
4. **API Key کاوه نگار** از `VITE_KAVENEGAR_API_KEY` خوانده می‌شود
5. **همه آدرس‌های هاردکد شده حذف شده‌اند** - هیچ fallback value وجود ندارد
6. **تغییر آدرس فقط از طریق متغیرهای محیطی** انجام می‌شود
7. **اگر متغیرهای محیطی الزامی تنظیم نشوند، خطا نمایش داده می‌شود**

## استفاده از فایل‌های Seed

برای استفاده از فایل‌های seed، ابتدا متغیر محیطی را تنظیم کنید:

```bash
# تنظیم متغیر محیطی
export API_URL=https://your-api-domain.com/api/content

# یا استفاده از VITE_API_URL
export VITE_API_URL=https://your-api-domain.com

# اجرای فایل‌های seed
node seed-hero-data.js
node seed-content.js
```

## تست تنظیمات

برای اطمینان از صحت تنظیمات:

1. سرور را راه‌اندازی کنید
2. Frontend را اجرا کنید
3. عملکرد آپلود تصویر را تست کنید
4. API calls را بررسی کنید
5. فایل‌های seed را تست کنید
