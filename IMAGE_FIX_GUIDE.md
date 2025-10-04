# راهنمای حل مشکل نمایش تصاویر در Production

## 🔍 مشکل
تصاویر در production با خطای 404 نمایش داده می‌شوند:
```
GET https://ghesti.peykkhorshid.ir/uploads/images/image-xxx.jpg 404 (Not Found)
```

## 🔧 راه‌حل‌های پیاده‌سازی شده

### 1️⃣ **به‌روزرسانی سرور (server/index.js)**
- اضافه کردن fallback route برای تصاویر
- بررسی وجود فایل قبل از ارسال
- پیام خطای مناسب برای فایل‌های موجود نبودن

### 2️⃣ **اسکریپت کپی تصاویر**
- `copy-images-to-production.js` برای کپی تصاویر به production
- ایجاد پوشه `dist/uploads/images/`
- کپی خودکار در build process

### 3️⃣ **به‌روزرسانی Build Process**
- اضافه کردن `copy-images` به script build
- کپی خودکار تصاویر هنگام build

## 📋 مراحل Deploy

### **مرحله 1: Build کردن پروژه**
```bash
npm run build
```
این دستور:
- Frontend را build می‌کند
- فایل‌های `.htaccess` را کپی می‌کند
- تصاویر را از `server/uploads/images/` به `dist/uploads/images/` کپی می‌کند

### **مرحله 2: آپلود به هاست**
```
public_html/
├── index.html (از dist/)
├── assets/ (از dist/)
├── uploads/
│   └── images/ (از dist/uploads/images/)
│       ├── image-1234567890-123456789.png
│       └── .htaccess
└── .htaccess (از dist/)
```

### **مرحله 3: تنظیمات سرور Backend**
در سرور Node.js، متغیرهای محیطی:
```bash
BASE_URL=https://ghesti.peykkhorshid.ir
NODE_ENV=production
```

## 🛠️ تست کردن

### **تست Frontend:**
```bash
# بررسی وجود تصاویر در dist
ls -la dist/uploads/images/

# تست دسترسی به تصویر
curl https://ghesti.peykkhorshid.ir/uploads/images/your-image.jpg
```

### **تست Backend:**
```bash
# تست API لیست تصاویر
curl https://ghesti.peykkhorshid.ir/api/upload/list

# تست آپلود تصویر جدید
curl -X POST -F "image=@test.jpg" https://ghesti.peykkhorshid.ir/api/upload
```

## 🔍 عیب‌یابی

### **اگر تصاویر هنوز نمایش داده نمی‌شوند:**

1. **بررسی وجود فایل:**
   ```bash
   ls -la dist/uploads/images/
   ```

2. **بررسی دسترسی‌ها:**
   ```bash
   chmod 755 dist/uploads/images/
   chmod 644 dist/uploads/images/*
   ```

3. **بررسی .htaccess:**
   ```bash
   cat dist/uploads/images/.htaccess
   ```

4. **بررسی سرور:**
   ```bash
   # تست دسترسی مستقیم
   curl -I https://ghesti.peykkhorshid.ir/uploads/images/your-image.jpg
   ```

### **اگر تصاویر جدید آپلود نمی‌شوند:**

1. **بررسی متغیرهای محیطی سرور:**
   ```bash
   echo $BASE_URL
   echo $NODE_ENV
   ```

2. **بررسی دسترسی‌های پوشه:**
   ```bash
   chmod 755 server/uploads/images/
   ```

## 📝 نکات مهم

### **1. امنیت:**
- فایل `.htaccess` در پوشه تصاویر اجرای PHP را مسدود می‌کند
- فقط فایل‌های تصویری مجاز هستند

### **2. عملکرد:**
- Cache headers برای تصاویر تنظیم شده‌اند
- تصاویر برای 1 سال cache می‌شوند

### **3. پشتیبانی از فرمت‌ها:**
- JPG, JPEG, PNG, GIF, WebP, SVG

## 🚀 دستورات سریع

### **Build کامل:**
```bash
npm run build
```

### **کپی دستی تصاویر:**
```bash
npm run copy-images
```

### **تست محلی:**
```bash
npm run preview
```

### **Deploy:**
```bash
./deploy.sh
# انتخاب "prod"
```

## ✅ نتیجه
پس از اعمال این تغییرات:
- ✅ تصاویر در production نمایش داده می‌شوند
- ✅ آپلود تصاویر جدید کار می‌کند
- ✅ Build process خودکار است
- ✅ امنیت و عملکرد بهینه شده
