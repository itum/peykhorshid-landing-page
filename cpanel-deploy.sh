#!/bin/bash

# اسکریپت Deploy برای cPanel
echo "🚀 شروع Deploy برای cPanel..."

# دریافت اطلاعات cPanel
read -p "آدرس هاست cPanel: " CPANEL_HOST
read -p "نام کاربری cPanel: " CPANEL_USER
read -p "مسیر public_html (مثال: /home/username/public_html): " PUBLIC_HTML
read -p "مسیر backend (مثال: /home/username/backend): " BACKEND_PATH

echo "📝 اطلاعات cPanel:"
echo "   Host: $CPANEL_HOST"
echo "   User: $CPANEL_USER"
echo "   Frontend: $PUBLIC_HTML"
echo "   Backend: $BACKEND_PATH"
echo ""

# Build Frontend
echo "🏗️ Build کردن Frontend..."
cp .env.production .env
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build Frontend ناموفق"
    exit 1
fi

echo "✅ Frontend build شد"

# آپلود Frontend
echo "📁 آپلود Frontend..."
scp -r dist/* $CPANEL_USER@$CPANEL_HOST:$PUBLIC_HTML/

if [ $? -ne 0 ]; then
    echo "❌ آپلود Frontend ناموفق"
    exit 1
fi

echo "✅ Frontend آپلود شد"

# آپلود Backend
echo "📁 آپلود Backend..."
scp -r server/* $CPANEL_USER@$CPANEL_HOST:$BACKEND_PATH/

if [ $? -ne 0 ]; then
    echo "❌ آپلود Backend ناموفق"
    exit 1
fi

echo "✅ Backend آپلود شد"

# اجرای دستورات در cPanel
echo "🔧 تنظیمات cPanel..."

ssh $CPANEL_USER@$CPANEL_HOST << EOF
    echo "📦 نصب وابستگی‌های Backend..."
    cd $BACKEND_PATH
    npm install --production
    
    echo "📁 ایجاد پوشه تصاویر..."
    mkdir -p $PUBLIC_HTML/uploads/images
    
    echo "📸 کپی تصاویر..."
    cp -r $BACKEND_PATH/uploads/images/* $PUBLIC_HTML/uploads/images/ 2>/dev/null || echo "پوشه تصاویر خالی است"
    
    echo "🔐 تنظیم دسترسی‌ها..."
    chmod 755 $PUBLIC_HTML/uploads/images/
    chmod 644 $PUBLIC_HTML/uploads/images/* 2>/dev/null || echo "فایل تصویری یافت نشد"
    
    echo "📄 ایجاد .htaccess..."
    cat > $PUBLIC_HTML/.htaccess << 'HTACCESS_EOF'
RewriteEngine On

# مسیریابی API به Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# مسیریابی تصاویر به Node.js
RewriteCond %{REQUEST_URI} ^/uploads/images/
RewriteRule ^uploads/images/(.*)$ http://localhost:3001/uploads/images/$1 [P,L]

# مسیریابی فایل‌های static
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
HTACCESS_EOF
    
    echo "📄 ایجاد .htaccess برای تصاویر..."
    cat > $PUBLIC_HTML/uploads/images/.htaccess << 'IMG_HTACCESS_EOF'
# تنظیمات برای تصاویر
RewriteEngine On

# تنظیم نوع محتوا
<FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# امنیت: جلوگیری از اجرای PHP
<FilesMatch "\\.(php|phtml|php3|php4|php5|php7|pl|py|jsp|asp|sh|cgi)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
IMG_HTACCESS_EOF
    
    echo "✅ تنظیمات cPanel کامل شد!"
    echo ""
    echo "📋 مراحل بعدی در cPanel:"
    echo "1. Node.js Selector را باز کنید"
    echo "2. Create Application کلیک کنید"
    echo "3. تنظیمات:"
    echo "   - Node.js version: 18.x"
    echo "   - Application root: $BACKEND_PATH"
    echo "   - Application URL: /api"
    echo "   - Application startup file: index.js"
    echo "4. Environment Variables اضافه کنید:"
    echo "   - NODE_ENV=production"
    echo "   - BASE_URL=https://ghesti.peykkhorshid.ir"
    echo "   - PORT=3001"
    echo "   - DB_HOST=localhost"
    echo "   - DB_USER=your_username"
    echo "   - DB_PASSWORD=your_password"
    echo "   - DB_NAME=peykhorshid"
    echo "5. Start Application کلیک کنید"
EOF

if [ $? -eq 0 ]; then
    echo "🎉 Deploy cPanel با موفقیت انجام شد!"
    echo ""
    echo "📋 مراحل باقی‌مانده:"
    echo "1. cPanel → Node.js Selector"
    echo "2. Create Application"
    echo "3. تنظیم Environment Variables"
    echo "4. Start Application"
    echo ""
    echo "🔗 تست کردن:"
    echo "   Frontend: https://ghesti.peykkhorshid.ir"
    echo "   API: https://ghesti.peykkhorshid.ir/api/content/home/hero"
    echo "   Images: https://ghesti.peykkhorshid.ir/uploads/images/"
else
    echo "❌ خطا در تنظیمات cPanel"
    exit 1
fi
