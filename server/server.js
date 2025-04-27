const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 8080;

// فعال‌سازی فشرده‌سازی gzip برای همه درخواست‌ها
app.use(compression());

// سرو فایل‌های استاتیک از پوشه dist
app.use(express.static(path.join(__dirname, '../dist')));

// تنظیم کش برای فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: '30d', // کش فایل‌های استاتیک برای 30 روز
  setHeaders: (res, path) => {
    // تنظیم هدرهای مناسب برای فایل‌های مختلف
    if (path.endsWith('.html')) {
      // فایل‌های HTML نباید کش شوند
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$/)) {
      // کش طولانی‌مدت برای فایل‌های استاتیک
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 روز
    }
  }
}));

// راه‌اندازی API
// اینجا می‌توانید API‌های خود را تعریف کنید

// ارسال همه مسیرهای دیگر به فایل index.html برای SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 