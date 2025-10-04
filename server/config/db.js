const mysql = require('mysql2/promise');

// تنظیمات اتصال به پایگاه داده از متغیرهای محیطی
const connection = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'peykkhorshid',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
};

// بررسی تنظیمات دیتابیس
if (!process.env.DB_HOST && !process.env.DB_USER) {
  console.warn('⚠️ هشدار: متغیرهای محیطی دیتابیس تنظیم نشده‌اند. از مقادیر پیش‌فرض استفاده می‌شود.');
  console.log('لطفاً متغیرهای زیر را در فایل .env تنظیم کنید:');
  console.log('DB_HOST=localhost');
  console.log('DB_USER=your_username');
  console.log('DB_PASSWORD=your_password');
  console.log('DB_NAME=peykkhorshid');
  console.log('DB_PORT=3306');
}

// ایجاد پول اتصال
const pool = mysql.createPool(connection);

// بررسی اتصال به پایگاه داده
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('اتصال به پایگاه داده با موفقیت برقرار شد!');
    conn.release();
    return true;
  } catch (error) {
    console.error('خطا در اتصال به پایگاه داده:', error);
    return false;
  }
};

module.exports = {
  pool,
  connection,
  testConnection
}; 