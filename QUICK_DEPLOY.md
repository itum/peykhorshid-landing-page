# 🚀 Deploy سریع

## برای Development:
```bash
./deploy.sh
# سپس "dev" را انتخاب کنید
```

## برای Production:
```bash
./deploy.sh
# سپس "prod" را انتخاب کنید
```

## Manual Deploy:

### Development:
```bash
cp .env.development .env
npm run dev
```

### Production:
```bash
cp .env.production .env
npm run build
```

## 📁 فایل‌های Environment:
- `.env.development` - تنظیمات development
- `.env.production` - تنظیمات production  
- `server/.env` - تنظیمات backend

## 🔧 تنظیمات مهم:
- **VITE_API_URL**: آدرس API سرور
- **VITE_KAVENEGAR_API_KEY**: کلید API کاوه نگار
- **DB_***: تنظیمات دیتابیس
