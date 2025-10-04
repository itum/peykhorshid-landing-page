# عیب‌یابی مشکل cPanel

## 🔍 مشکل شناسایی شده
- ✅ Admin panel کار می‌کند: `https://ghesti.peykkhorshid.ir/b46f92e1dca3p7z8`
- ❌ تصاویر نمایش داده نمی‌شوند (آیکون شکسته)
- ❌ ارتباط با سرور Node.js برقرار نمی‌شود

## 🛠️ راه‌حل‌های cPanel

### **1. بررسی Node.js App**

#### **در cPanel:**
1. **Node.js Selector** را باز کنید
2. **Create Application** کلیک کنید
3. تنظیمات:
   ```
   Node.js version: 18.x یا 20.x
   Application mode: Production
   Application root: /home/username/backend
   Application URL: /api
   Application startup file: index.js
   ```

### **2. تنظیمات Environment Variables**

#### **در Node.js App:**
```bash
NODE_ENV=production
BASE_URL=https://ghesti.peykkhorshid.ir
PORT=3001
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=peykhorshid
DB_PORT=3306
```

### **3. مسیریابی تصاویر**

#### **مشکل اصلی:**
تصاویر از `/uploads/images/` درخواست می‌شوند اما cPanel نمی‌تواند آن‌ها را serve کند.

#### **راه‌حل 1: Static Files**
```bash
# در public_html
mkdir -p public_html/uploads/images
cp -r backend/uploads/images/* public_html/uploads/images/
```

#### **راه‌حل 2: .htaccess**
```apache
# در public_html/.htaccess
RewriteEngine On

# مسیریابی API
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# مسیریابی تصاویر به Node.js
RewriteCond %{REQUEST_URI} ^/uploads/images/
RewriteRule ^uploads/images/(.*)$ http://localhost:3001/uploads/images/$1 [P,L]

# مسیریابی static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
```

### **4. بررسی Port و Process**

#### **در Terminal هاست:**
```bash
# بررسی Node.js process
ps aux | grep node

# بررسی port
netstat -tulpn | grep 3001

# بررسی log ها
tail -f ~/logs/nodejs.log
```

### **5. تست API**

#### **در مرورگر:**
```bash
# تست مستقیم API
https://ghesti.peykkhorshid.ir/api/content/home/hero

# تست تصاویر
https://ghesti.peykkhorshid.ir/uploads/images/image-xxx.jpg
```

## 🔧 مراحل عیب‌یابی

### **مرحله 1: بررسی Node.js App**
1. cPanel → Node.js Selector
2. بررسی وجود app
3. بررسی status (Running/Stopped)

### **مرحله 2: بررسی Environment**
1. Node.js App → Environment Variables
2. بررسی BASE_URL
3. بررسی DB settings

### **مرحله 3: بررسی Files**
1. File Manager
2. بررسی وجود `backend/uploads/images/`
3. بررسی permissions

### **مرحله 4: تست API**
1. Browser Developer Tools
2. Network tab
3. بررسی 404 errors

## 📋 چک‌لیست cPanel

- [ ] Node.js App ایجاد شده
- [ ] Environment Variables تنظیم شده
- [ ] Port 3001 آزاد است
- [ ] Database متصل است
- [ ] Files کپی شده‌اند
- [ ] .htaccess تنظیم شده
- [ ] API تست شده

## 🚨 مشکلات رایج cPanel

### **1. Port Conflict**
```bash
# تغییر port در .env
PORT=8080
```

### **2. File Permissions**
```bash
chmod 755 backend/uploads/images/
chmod 644 backend/uploads/images/*
```

### **3. Database Connection**
```bash
# بررسی در cPanel
DB_HOST=localhost
DB_USER=cpanel_username
DB_PASSWORD=strong_password
```

### **4. Static Files**
```bash
# کپی تصاویر به public_html
cp -r backend/uploads/images/* public_html/uploads/images/
```
