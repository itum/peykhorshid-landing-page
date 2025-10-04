# راهنمای سریع راه‌اندازی

## 🚀 راه‌اندازی سریع

### 1. اجرای اسکریپت راه‌اندازی
```bash
./setup-env.sh
```

### 2. ویرایش فایل‌های .env

#### Frontend (.env):
```bash
VITE_API_URL=http://localhost:3001
VITE_KAVENEGAR_API_KEY=your_api_key_here
```

#### Server (server/.env):
```bash
BASE_URL=http://localhost:3001
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=peykkhorshid
```

### 3. راه‌اندازی سرور
```bash
cd server
npm install
npm start
```

### 4. راه‌اندازی Frontend
```bash
npm install
npm run dev
```

## 📁 فایل‌های ایجاد شده

- `FRONTEND_ENV_TEMPLATE.txt` - قالب فایل .env برای Frontend
- `SERVER_ENV_TEMPLATE.txt` - قالب فایل .env برای Server
- `setup-env.sh` - اسکریپت راه‌اندازی خودکار
- `ENV_SETUP_GUIDE.md` - راهنمای کامل

## ⚠️ نکات مهم

1. **فایل‌های .env** در gitignore هستند و commit نمی‌شوند
2. **همه آدرس‌های هاردکد شده حذف شده‌اند**
3. **سیستم کاملاً از متغیرهای محیطی استفاده می‌کند**
4. **اگر متغیرهای الزامی تنظیم نشوند، خطا نمایش داده می‌شود**

## 🔧 عیب‌یابی

اگر خطایی دریافت کردید:
1. بررسی کنید که فایل‌های .env ایجاد شده‌اند
2. مقادیر درون فایل‌های .env را بررسی کنید
3. مطمئن شوید که سرور دیتابیس در حال اجرا است
4. لاگ‌های کنسول را بررسی کنید

