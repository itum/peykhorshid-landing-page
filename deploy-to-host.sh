#!/bin/bash

# اسکریپت Deploy خودکار به هاست
echo "🚀 شروع Deploy به هاست..."

# دریافت اطلاعات هاست
read -p "آدرس هاست (مثال: user@host.com): " HOST
read -p "مسیر Frontend در هاست (مثال: /home/user/public_html): " FRONTEND_PATH
read -p "مسیر Backend در هاست (مثال: /home/user/backend): " BACKEND_PATH

# بررسی ورودی‌ها
if [ -z "$HOST" ] || [ -z "$FRONTEND_PATH" ] || [ -z "$BACKEND_PATH" ]; then
    echo "❌ همه فیلدها الزامی هستند"
    exit 1
fi

echo "📝 اطلاعات هاست:"
echo "   Host: $HOST"
echo "   Frontend Path: $FRONTEND_PATH"
echo "   Backend Path: $BACKEND_PATH"
echo ""

# Build کردن Frontend
echo "🏗️ Build کردن Frontend..."
cp .env.production .env
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build Frontend ناموفق"
    exit 1
fi

echo "✅ Frontend build شد"

# کپی فایل‌های Frontend
echo "📁 کپی فایل‌های Frontend..."
scp -r dist/* $HOST:$FRONTEND_PATH/

if [ $? -ne 0 ]; then
    echo "❌ کپی Frontend ناموفق"
    exit 1
fi

echo "✅ Frontend کپی شد"

# کپی فایل‌های Backend
echo "📁 کپی فایل‌های Backend..."
scp -r server/* $HOST:$BACKEND_PATH/

if [ $? -ne 0 ]; then
    echo "❌ کپی Backend ناموفق"
    exit 1
fi

echo "✅ Backend کپی شد"

# اجرای دستورات در هاست
echo "🔧 اجرای دستورات در هاست..."

ssh $HOST << EOF
    echo "📦 نصب وابستگی‌های Backend..."
    cd $BACKEND_PATH
    npm install --production
    
    echo "🔄 ریستارت سرور..."
    pm2 restart peykhorshid-api || pm2 start index.js --name "peykhorshid-api"
    
    echo "💾 ذخیره تنظیمات PM2..."
    pm2 save
    
    echo "✅ Deploy کامل شد!"
    echo "🌐 Frontend: https://ghesti.peykkhorshid.ir"
    echo "🔗 API: https://ghesti.peykkhorshid.ir/api"
EOF

if [ $? -eq 0 ]; then
    echo "🎉 Deploy با موفقیت انجام شد!"
    echo ""
    echo "📋 تست کردن:"
    echo "   Frontend: https://ghesti.peykkhorshid.ir"
    echo "   API Health: https://ghesti.peykkhorshid.ir/api/content/home/hero"
    echo "   Images: https://ghesti.peykkhorshid.ir/uploads/images/"
else
    echo "❌ خطا در اجرای دستورات هاست"
    exit 1
fi
