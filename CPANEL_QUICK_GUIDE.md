# 🚀 راهنمای سریع cPanel

## 🔍 مشکل فعلی
- ✅ Admin panel کار می‌کند: `https://ghesti.peykkhorshid.ir/b46f92e1dca3p7z8`
- ❌ تصاویر نمایش داده نمی‌شوند
- ❌ API ارتباط برقرار نمی‌کند

## 🛠️ راه‌حل سریع

### **مرحله 1: Deploy خودکار**
```bash
./cpanel-deploy.sh
```

### **مرحله 2: تنظیمات cPanel**

#### **1. Node.js Selector:**
1. cPanel → **Node.js Selector**
2. **Create Application** کلیک کنید
3. تنظیمات:
   ```
   Node.js version: 18.x
   Application mode: Production
   Application root: /home/username/backend
   Application URL: /api
   Application startup file: index.js
   ```

#### **2. Environment Variables:**
```
NODE_ENV=production
BASE_URL=https://ghesti.peykkhorshid.ir
PORT=3001
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=peykhorshid
DB_PORT=3306
```

#### **3. Start Application:**
- **Start Application** کلیک کنید

### **مرحله 3: بررسی نتایج**

#### **تست‌ها:**
```bash
# Frontend
https://ghesti.peykkhorshid.ir

# API
https://ghesti.peykkhorshid.ir/api/content/home/hero

# Images
https://ghesti.peykkhorshid.ir/uploads/images/image-xxx.jpg
```

## 🔧 عیب‌یابی

### **اگر Node.js App شروع نمی‌شود:**
1. **Logs** را بررسی کنید
2. **Port** را تغییر دهید (8080, 8081)
3. **Environment Variables** را بررسی کنید

### **اگر تصاویر نمایش داده نمی‌شوند:**
1. **File Manager** → `public_html/uploads/images/`
2. **Permissions** را بررسی کنید (755)
3. **.htaccess** را بررسی کنید

### **اگر API کار نمی‌کند:**
1. **Node.js App Status** را بررسی کنید
2. **Database Connection** را تست کنید
3. **Port** را بررسی کنید

## 📋 چک‌لیست

- [ ] Frontend آپلود شده
- [ ] Backend آپلود شده
- [ ] Node.js App ایجاد شده
- [ ] Environment Variables تنظیم شده
- [ ] Application شروع شده
- [ ] .htaccess تنظیم شده
- [ ] تصاویر کپی شده‌اند
- [ ] API تست شده
- [ ] تصاویر تست شده‌اند

## 🚨 مشکلات رایج

### **1. Port Conflict:**
```bash
# در Environment Variables
PORT=8080
```

### **2. Database Connection:**
```bash
# بررسی در cPanel
DB_HOST=localhost
DB_USER=cpanel_username
```

### **3. File Permissions:**
```bash
chmod 755 public_html/uploads/images/
chmod 644 public_html/uploads/images/*
```

## 📞 پشتیبانی

### **لاگ‌های مهم:**
- Node.js logs در cPanel
- Error logs در cPanel
- Browser Developer Tools

### **دستورات مفید:**
```bash
# بررسی process
ps aux | grep node

# بررسی port
netstat -tulpn | grep 3001

# بررسی files
ls -la public_html/uploads/images/
```
