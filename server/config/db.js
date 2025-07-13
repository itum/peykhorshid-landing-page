const mysql = require('mysql2/promise');

// تنظیمات اتصال به پایگاه داده
// const connection = {
//   host: 'localhost',
//   user: 'farazec',
//   password: 'M@@sdfsfsdf2138123',
//   database: 'peykkhorshid',
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };
// Localhost
const connection = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hadis',
  port: 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

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