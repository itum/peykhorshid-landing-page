const { pool } = require('../config/db');

class Contact {
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await connection.query(createTableQuery);
      console.log('جدول پیام‌های تماس با ما با موفقیت ایجاد شد یا از قبل وجود داشت.');
      connection.release();
      return true;
    } catch (error) {
      console.error('خطا در ایجاد جدول پیام‌های تماس با ما:', error);
      throw error;
    }
  }

  static async create(contactData) {
    try {
      const connection = await pool.getConnection();
      const { name, phone, message } = contactData;
      
      const [result] = await connection.query(
        'INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?)',
        [name, phone, message]
      );
      
      connection.release();
      
      return {
        id: result.insertId,
        name,
        phone,
        message,
        created_at: new Date(),
        is_read: false
      };
    } catch (error) {
      console.error('خطا در ثبت پیام تماس با ما:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM contacts ORDER BY created_at DESC');
      connection.release();
      return rows;
    } catch (error) {
      console.error('خطا در دریافت پیام‌های تماس با ما:', error);
      throw error;
    }
  }

  static async markAsRead(id) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE contacts SET is_read = true WHERE id = ?',
        [id]
      );
      
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      console.error('خطا در به‌روزرسانی وضعیت پیام:', error);
      throw error;
    }
  }
}

module.exports = Contact; 