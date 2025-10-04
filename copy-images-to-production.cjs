#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * اسکریپت کپی تصاویر از development به production
 * این اسکریپت تصاویر آپلود شده را از پوشه local به production کپی می‌کند
 */

const sourceDir = path.join(__dirname, 'server', 'uploads', 'images');
const productionDir = path.join(__dirname, 'dist', 'uploads', 'images');

console.log('🔄 شروع کپی تصاویر به production...');
console.log(`📁 مبدأ: ${sourceDir}`);
console.log(`📁 مقصد: ${productionDir}`);

// بررسی وجود پوشه مبدأ
if (!fs.existsSync(sourceDir)) {
  console.log('❌ پوشه تصاویر مبدأ وجود ندارد');
  process.exit(1);
}

// ایجاد پوشه مقصد در صورت عدم وجود
if (!fs.existsSync(productionDir)) {
  console.log('📁 ایجاد پوشه مقصد...');
  fs.mkdirSync(productionDir, { recursive: true });
}

// خواندن فایل‌های تصاویر
const files = fs.readdirSync(sourceDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
});

if (files.length === 0) {
  console.log('ℹ️ هیچ تصویری برای کپی یافت نشد');
  process.exit(0);
}

console.log(`📸 یافت شد ${files.length} تصویر`);

// کپی کردن فایل‌ها
let copiedCount = 0;
let errorCount = 0;

files.forEach(file => {
  try {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(productionDir, file);
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ کپی شد: ${file}`);
    copiedCount++;
  } catch (error) {
    console.error(`❌ خطا در کپی ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\n📊 خلاصه:');
console.log(`✅ کپی شده: ${copiedCount}`);
console.log(`❌ خطا: ${errorCount}`);
console.log('🎉 عملیات تمام شد!');

// ایجاد فایل .htaccess برای تصاویر
const htaccessContent = `# تنظیمات برای تصاویر آپلود شده
RewriteEngine On

# تنظیم نوع محتوا برای تصاویر
<FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg)$">
    Header set Cache-Control "public, max-age=31536000"
    Header set Content-Type "image/jpeg"
</FilesMatch>

# تنظیم نوع محتوا برای SVG
<FilesMatch "\\.svg$">
    Header set Content-Type "image/svg+xml"
</FilesMatch>

# تنظیم نوع محتوا برای PNG
<FilesMatch "\\.png$">
    Header set Content-Type "image/png"
</FilesMatch>

# تنظیم نوع محتوا برای WebP
<FilesMatch "\\.webp$">
    Header set Content-Type "image/webp"
</FilesMatch>

# امنیت: جلوگیری از اجرای فایل‌های PHP در پوشه تصاویر
<FilesMatch "\\.(php|phtml|php3|php4|php5|php7|pl|py|jsp|asp|sh|cgi)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
`;

try {
  const htaccessPath = path.join(productionDir, '.htaccess');
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log('📄 فایل .htaccess برای تصاویر ایجاد شد');
} catch (error) {
  console.error('❌ خطا در ایجاد .htaccess:', error.message);
}
