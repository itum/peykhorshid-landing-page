# راهنمای Deploy پروژه Peyk Khorshid

## 📋 مراحل Deploy

### 1️⃣ **آماده‌سازی فایل‌های Environment**

#### **Frontend (برای Development):**
```bash
# کپی کردن فایل development
cp .env.development .env
```

#### **Frontend (برای Production):**
```bash
# کپی کردن فایل production
cp .env.production .env
```

#### **Backend:**
```bash
# کپی کردن فایل server
cp server/.env.example server/.env
# یا ویرایش مستقیم server/.env
```

### 2️⃣ **تنظیمات Environment Variables**

#### **Frontend (.env):**
```bash
# برای Development
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
VITE_DEBUG=true

# برای Production
VITE_API_URL=https://ghesti.peykkhorshid.ir
VITE_APP_ENV=production
VITE_DEBUG=false
```

#### **Backend (server/.env):**
```bash
# برای Development
BASE_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=peykhorshid
DB_PORT=3308

# برای Production
BASE_URL=https://ghesti.peykkhorshid.ir
PORT=3001
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=peykhorshid
DB_PORT=3306
```

### 3️⃣ **Build کردن پروژه**

#### **Development Build:**
```bash
npm run build:dev
```

#### **Production Build:**
```bash
npm run build
```

### 4️⃣ **Deploy کردن**

#### **Frontend (Static Files):**
```bash
# فایل‌های dist/ را به هاست آپلود کنید
# یا از Netlify/Vercel استفاده کنید
```

#### **Backend (Node.js):**
```bash
cd server
npm install --production
npm start
```

### 5️⃣ **تست کردن**

#### **Frontend:**
- باز کردن `http://localhost:8080` (development)
- یا آدرس production

#### **Backend:**
- تست API: `http://localhost:3001/api/health`
- تست endpoints: `http://localhost:3001/api/content/home/hero`

## 🔧 **نکات مهم:**

### **1. Database Setup:**
```bash
# ایجاد دیتابیس
mysql -u root -p -e "CREATE DATABASE peykhorshid;"

# اجرای seed files
node seed-hero-data.js
node seed-content.js
```

### **2. File Permissions:**
```bash
# تنظیم دسترسی‌های فایل
chmod 755 server/uploads/images
```

### **3. CORS Configuration:**
- در production، `CORS_ORIGIN` را به دامنه production تنظیم کنید

### **4. SSL Certificate:**
- برای production، SSL certificate تنظیم کنید
- از HTTPS استفاده کنید

## 🚀 **Quick Deploy Commands:**

### **Development:**
```bash
# Frontend
cp .env.development .env
npm run dev

# Backend
cd server
npm run dev
```

### **Production:**
```bash
# Frontend
cp .env.production .env
npm run build

# Backend
cd server
npm start
```

## 📞 **پشتیبانی:**
در صورت مشکل، فایل‌های log را بررسی کنید:
- Frontend: Browser Console
- Backend: Terminal logs
- Database: MySQL logs
