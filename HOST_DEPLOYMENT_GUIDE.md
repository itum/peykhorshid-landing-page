# راهنمای Deploy در هاست

## 🔧 مشکل حل شده
خطای `path-to-regexp` که در هاست رخ می‌داد، با اصلاح route تصاویر حل شد.

## 📋 مراحل Deploy در هاست

### **مرحله 1: آماده‌سازی فایل‌ها**

#### **Frontend:**
```bash
# در کامپیوتر محلی
npm run build
```

#### **Backend:**
```bash
# کپی فایل‌های سرور
cp -r server/ your-hosting-backend-folder/
```

### **مرحله 2: تنظیمات هاست**

#### **Frontend (Static Files):**
```
public_html/
├── index.html
├── assets/
├── uploads/
│   └── images/
│       ├── image-xxx.jpg
│       └── .htaccess
└── .htaccess
```

#### **Backend (Node.js):**
```
backend/
├── index.js
├── package.json
├── controllers/
├── models/
├── routes/
├── config/
├── uploads/
│   └── images/
└── .env
```

### **مرحله 3: تنظیمات Environment Variables**

#### **Backend (.env):**
```bash
BASE_URL=https://ghesti.peykkhorshid.ir
PORT=3001
NODE_ENV=production
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=peykhorshid
DB_PORT=3306
```

#### **Frontend (.env.production):**
```bash
VITE_API_URL=https://ghesti.peykkhorshid.ir
VITE_APP_ENV=production
VITE_DEBUG=false
```

### **مرحله 4: نصب وابستگی‌ها**

#### **Backend:**
```bash
cd backend
npm install --production
```

### **مرحله 5: راه‌اندازی سرور**

#### **با PM2 (توصیه می‌شود):**
```bash
# نصب PM2
npm install -g pm2

# راه‌اندازی سرور
pm2 start index.js --name "peykhorshid-api"

# ذخیره تنظیمات PM2
pm2 save
pm2 startup
```

#### **بدون PM2:**
```bash
# راه‌اندازی مستقیم
node index.js

# یا در background
nohup node index.js > server.log 2>&1 &
```

### **مرحله 6: تنظیمات وب سرور (Apache/Nginx)**

#### **Apache (.htaccess):**
```apache
RewriteEngine On

# مسیریابی API به سرور Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# مسیریابی تصاویر
RewriteCond %{REQUEST_URI} ^/uploads/images/
RewriteRule ^uploads/images/(.*)$ http://localhost:3001/uploads/images/$1 [P,L]

# مسیریابی فایل‌های static
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
```

#### **Nginx:**
```nginx
server {
    listen 80;
    server_name ghesti.peykkhorshid.ir;
    
    # Frontend
    location / {
        root /path/to/public_html;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Images
    location /uploads/images/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 عیب‌یابی

### **اگر سرور راه‌اندازی نمی‌شود:**

1. **بررسی وابستگی‌ها:**
   ```bash
   cd backend
   npm install
   ```

2. **بررسی متغیرهای محیطی:**
   ```bash
   cat .env
   ```

3. **بررسی پورت:**
   ```bash
   netstat -tulpn | grep 3001
   ```

4. **بررسی لاگ‌ها:**
   ```bash
   tail -f server.log
   ```

### **اگر API کار نمی‌کند:**

1. **تست مستقیم سرور:**
   ```bash
   curl http://localhost:3001/api/content/home/hero
   ```

2. **بررسی فایروال:**
   ```bash
   sudo ufw allow 3001
   ```

3. **بررسی CORS:**
   - در `server/index.js` تنظیمات CORS را بررسی کنید

### **اگر تصاویر نمایش داده نمی‌شوند:**

1. **بررسی وجود پوشه:**
   ```bash
   ls -la backend/uploads/images/
   ```

2. **بررسی دسترسی‌ها:**
   ```bash
   chmod 755 backend/uploads/images/
   chmod 644 backend/uploads/images/*
   ```

3. **تست مستقیم:**
   ```bash
   curl http://localhost:3001/uploads/images/your-image.jpg
   ```

## 🚀 دستورات سریع

### **Deploy کامل:**
```bash
# 1. Build frontend
npm run build

# 2. کپی فایل‌ها به هاست
scp -r dist/* user@host:/path/to/public_html/
scp -r server/* user@host:/path/to/backend/

# 3. در هاست
cd backend
npm install --production
pm2 start index.js --name "peykhorshid-api"
```

### **بروزرسانی:**
```bash
# 1. Build جدید
npm run build

# 2. کپی فایل‌ها
scp -r dist/* user@host:/path/to/public_html/

# 3. ریستارت سرور
pm2 restart peykhorshid-api
```

## 📞 پشتیبانی

### **لاگ‌های مهم:**
- Frontend: Browser Console
- Backend: PM2 logs یا server.log
- Database: MySQL logs

### **دستورات مفید:**
```bash
# وضعیت PM2
pm2 status

# لاگ‌های PM2
pm2 logs peykhorshid-api

# ریستارت PM2
pm2 restart peykhorshid-api

# توقف PM2
pm2 stop peykhorshid-api
```

## ✅ چک‌لیست Deploy

- [ ] Frontend build شده
- [ ] فایل‌های dist/ آپلود شده‌اند
- [ ] Backend کپی شده است
- [ ] .env تنظیم شده است
- [ ] وابستگی‌ها نصب شده‌اند
- [ ] سرور Node.js راه‌اندازی شده است
- [ ] وب سرور تنظیم شده است
- [ ] دیتابیس متصل است
- [ ] API تست شده است
- [ ] تصاویر نمایش داده می‌شوند
