@echo off
REM اسکریپت کپی فایل .htaccess برای Windows
REM این اسکریپت تضمین می‌کند که فایل .htaccess در پوشه dist موجود باشد

echo 🔄 شروع کپی فایل .htaccess...

REM بررسی وجود پوشه dist
if not exist "dist" (
    echo ❌ پوشه dist وجود ندارد. ابتدا npm run build را اجرا کنید.
    exit /b 1
)

REM بررسی وجود فایل .htaccess در public
if not exist "public\.htaccess" (
    echo ❌ فایل .htaccess در پوشه public یافت نشد!
    echo 💡 مطمئن شوید که فایل .htaccess در پوشه public قرار دارد.
    exit /b 1
)

REM کپی فایل .htaccess
copy "public\.htaccess" "dist\" >nul
if errorlevel 1 (
    echo ❌ خطا در کپی فایل .htaccess
    exit /b 1
)

echo ✅ فایل .htaccess با موفقیت به پوشه dist کپی شد.
echo 🎉 عملیات کپی با موفقیت تکمیل شد!

exit /b 0
