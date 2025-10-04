# 🚀 Deploy سریع به هاست

## مشکل حل شده ✅
خطای `path-to-regexp` که در هاست رخ می‌داد، **حل شد**.

## روش‌های Deploy:

### **روش 1: اسکریپت خودکار**
```bash
./deploy-to-host.sh
```

### **روش 2: Manual**
```bash
# 1. Build
npm run build

# 2. کپی فایل‌ها
scp -r dist/* user@host:/path/to/frontend/
scp -r server/* user@host:/path/to/backend/

# 3. در هاست
cd backend
npm install --production
pm2 start index.js --name "peykhorshid-api"
```

## 🔧 تنظیمات هاست:

### **Frontend:**
- فایل‌های `dist/` را در `public_html/` قرار دهید

### **Backend:**
- فایل‌های `server/` را در پوشه backend قرار دهید
- فایل `.env` را تنظیم کنید
- PM2 را نصب و راه‌اندازی کنید

## 📋 چک‌لیست:
- [ ] Frontend build شده
- [ ] Backend کپی شده
- [ ] .env تنظیم شده
- [ ] PM2 راه‌اندازی شده
- [ ] API تست شده

## 📞 پشتیبانی:
- راهنمای کامل: `HOST_DEPLOYMENT_GUIDE.md`
- عیب‌یابی: `IMAGE_FIX_GUIDE.md`
