#!/bin/bash

# اسکریپت راه‌اندازی متغیرهای محیطی Peyk Khorshid
# این اسکریپت فایل‌های .env را از template ها ایجاد می‌کند

echo "🚀 راه‌اندازی متغیرهای محیطی Peyk Khorshid"
echo "================================================"

# بررسی وجود فایل‌های template
if [ ! -f "FRONTEND_ENV_TEMPLATE.txt" ]; then
    echo "❌ خطا: فایل FRONTEND_ENV_TEMPLATE.txt یافت نشد"
    exit 1
fi

if [ ! -f "SERVER_ENV_TEMPLATE.txt" ]; then
    echo "❌ خطا: فایل SERVER_ENV_TEMPLATE.txt یافت نشد"
    exit 1
fi

# ایجاد فایل .env برای Frontend
if [ ! -f ".env" ]; then
    cp FRONTEND_ENV_TEMPLATE.txt .env
    echo "✅ فایل .env برای Frontend ایجاد شد"
else
    echo "⚠️ فایل .env قبلاً وجود دارد، نادیده گرفته شد"
fi

# ایجاد فایل .env برای Server
if [ ! -f "server/.env" ]; then
    cp SERVER_ENV_TEMPLATE.txt server/.env
    echo "✅ فایل .env برای Server ایجاد شد"
else
    echo "⚠️ فایل server/.env قبلاً وجود دارد، نادیده گرفته شد"
fi

echo ""
echo "🎉 راه‌اندازی کامل شد!"
echo ""
echo "📝 مراحل بعدی:"
echo "1. فایل .env را ویرایش کنید و مقادیر را تنظیم کنید"
echo "2. فایل server/.env را ویرایش کنید و تنظیمات دیتابیس را وارد کنید"
echo "3. سرور را راه‌اندازی کنید: cd server && npm start"
echo "4. Frontend را اجرا کنید: npm run dev"
echo ""
echo "📚 برای راهنمای کامل، فایل ENV_SETUP_GUIDE.md را مطالعه کنید"

