const mysql = require('mysql2/promise');

// تنظیمات اتصال به پایگاه داده
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'peykhorshid',
  port: 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// بررسی اتصال به پایگاه داده
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('اتصال به پایگاه داده با موفقیت برقرار شد!');
    connection.release();
    return true;
  } catch (error) {
    console.error('خطا در اتصال به پایگاه داده:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
}; 