#!/bin/bash

# اسکریپت Deploy خودکار
echo "🚀 شروع Deploy پروژه Peyk Khorshid..."

# دریافت محیط (development یا production)
read -p "محیط deployment را انتخاب کنید (dev/prod): " env

if [ "$env" = "dev" ]; then
    echo "📝 تنظیم محیط Development..."
    cp .env.development .env
    echo "✅ فایل .env برای development تنظیم شد"
    
    echo "🔧 شروع Frontend Development..."
    npm run dev &
    FRONTEND_PID=$!
    
    echo "🔧 شروع Backend Development..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    echo "✅ هر دو سرور در حال اجرا هستند:"
    echo "   Frontend: http://localhost:8080 (PID: $FRONTEND_PID)"
    echo "   Backend: http://localhost:3001 (PID: $BACKEND_PID)"
    echo ""
    echo "برای متوقف کردن، Ctrl+C را فشار دهید"
    
    # انتظار برای Ctrl+C
    trap "kill $FRONTEND_PID $BACKEND_PID; exit" INT
    wait

elif [ "$env" = "prod" ]; then
    echo "📝 تنظیم محیط Production..."
    cp .env.production .env
    echo "✅ فایل .env برای production تنظیم شد"
    
    echo "🏗️ Build کردن Frontend..."
    npm run build
    echo "✅ Frontend build شد"
    
    echo "🔧 آماده‌سازی Backend..."
    cd server
    npm install --production
    echo "✅ Backend آماده شد"
    
    echo "🚀 شروع Production Server..."
    npm start &
    BACKEND_PID=$!
    cd ..
    
    echo "✅ Production Server در حال اجرا است:"
    echo "   Backend: http://localhost:3001 (PID: $BACKEND_PID)"
    echo "   Frontend: فایل‌های dist/ آماده برای آپلود"
    echo ""
    echo "برای متوقف کردن، Ctrl+C را فشار دهید"
    
    # انتظار برای Ctrl+C
    trap "kill $BACKEND_PID; exit" INT
    wait

else
    echo "❌ محیط نامعتبر. لطفاً 'dev' یا 'prod' وارد کنید"
    exit 1
fi

echo "👋 Deploy تمام شد!"
