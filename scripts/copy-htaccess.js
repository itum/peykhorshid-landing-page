#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * اسکریپت کپی فایل .htaccess برای تضمین وجود در build
 * Compatible با Windows, macOS و Linux
 * انتخاب فایل مناسب بر اساس محیط
 */

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// تشخیص محیط
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

// انتخاب فایل .htaccess مناسب
const htaccessSource = isProduction 
  ? path.join(publicDir, '.htaccess.production')
  : path.join(publicDir, '.htaccess');

const htaccessDestination = path.join(distDir, '.htaccess');

console.log(`🔄 شروع کپی فایل .htaccess برای محیط ${isProduction ? 'تولید' : 'توسعه'}...`);

// بررسی وجود پوشه dist
if (!fs.existsSync(distDir)) {
  console.error('❌ پوشه dist وجود ندارد. ابتدا npm run build را اجرا کنید.');
  process.exit(1);
}

// بررسی وجود فایل .htaccess در public
if (!fs.existsSync(htaccessSource)) {
  console.error(`❌ فایل ${path.basename(htaccessSource)} در پوشه public یافت نشد!`);
  console.log('💡 مطمئن شوید که فایل .htaccess مناسب در پوشه public قرار دارد.');
  process.exit(1);
}

try {
  // کپی فایل .htaccess
  fs.copyFileSync(htaccessSource, htaccessDestination);
  console.log(`✅ فایل ${path.basename(htaccessSource)} با موفقیت به پوشه dist کپی شد.`);
  
  // نمایش اطلاعات فایل
  const stats = fs.statSync(htaccessDestination);
  console.log(`📄 اندازه فایل: ${stats.size} بایت`);
  console.log(`📅 تاریخ ایجاد: ${stats.birthtime.toLocaleString('fa-IR')}`);
  
} catch (error) {
  console.error('❌ خطا در کپی فایل .htaccess:', error.message);
  process.exit(1);
}

console.log('🎉 عملیات کپی با موفقیت تکمیل شد!');
