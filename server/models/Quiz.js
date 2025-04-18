const { pool } = require('../config/db');

class Quiz {
  // ایجاد جدول quiz_users اگر وجود نداشته باشد
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS quiz_users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255),
          phone VARCHAR(20) NOT NULL,
          travel_destination VARCHAR(255),
          score INT,
          location VARCHAR(50),
          activities TEXT,
          duration VARCHAR(50),
          season VARCHAR(50),
          budget VARCHAR(50),
          adventure VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await connection.query(createTableQuery);
      console.log('جدول quiz_users با موفقیت ایجاد شد یا از قبل وجود داشت.');
      connection.release();
      return true;
    } catch (error) {
      console.error('خطا در ایجاد جدول quiz_users:', error);
      return false;
    }
  }

  // افزودن کاربر جدید به جدول
  static async addUser(userData) {
    try {
      const connection = await pool.getConnection();
      const insertQuery = `
        INSERT INTO quiz_users (
          name, phone, travel_destination, score, 
          location, activities, duration, season, budget, adventure
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const activities = Array.isArray(userData.quizAnswers.activities) 
        ? userData.quizAnswers.activities.join(', ') 
        : userData.quizAnswers.activities || '';
      
      const values = [
        userData.name || '',
        userData.phone,
        userData.travelDestination || '',
        userData.score || 0,
        userData.quizAnswers.location || '',
        activities,
        userData.quizAnswers.duration || '',
        userData.quizAnswers.season || '',
        userData.quizAnswers.budget || '',
        userData.quizAnswers.adventure || ''
      ];
      
      const [result] = await connection.query(insertQuery, values);
      connection.release();
      return result.insertId;
    } catch (error) {
      console.error('خطا در افزودن کاربر به جدول quiz_users:', error);
      return null;
    }
  }

  // دریافت تمام کاربران
  static async getAllUsers() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM quiz_users ORDER BY created_at DESC');
      connection.release();
      return rows;
    } catch (error) {
      console.error('خطا در دریافت کاربران از جدول quiz_users:', error);
      return [];
    }
  }

  // دریافت کاربر با شماره موبایل
  static async getUserByPhone(phone) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM quiz_users WHERE phone = ? ORDER BY created_at DESC LIMIT 1', [phone]);
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('خطا در دریافت کاربر با شماره موبایل:', error);
      return null;
    }
  }

  // به‌روزرسانی اطلاعات کاربر
  static async updateUser(userId, userData) {
    try {
      const connection = await pool.getConnection();
      const updateQuery = `
        UPDATE quiz_users SET
          name = ?,
          travel_destination = ?,
          score = ?,
          location = ?,
          activities = ?,
          duration = ?,
          season = ?,
          budget = ?,
          adventure = ?
        WHERE id = ?
      `;
      
      const activities = Array.isArray(userData.quizAnswers.activities) 
        ? userData.quizAnswers.activities.join(', ') 
        : userData.quizAnswers.activities || '';
      
      const values = [
        userData.name || '',
        userData.travelDestination || '',
        userData.score || 0,
        userData.quizAnswers.location || '',
        activities,
        userData.quizAnswers.duration || '',
        userData.quizAnswers.season || '',
        userData.quizAnswers.budget || '',
        userData.quizAnswers.adventure || '',
        userId
      ];
      
      const [result] = await connection.query(updateQuery, values);
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      console.error('خطا در به‌روزرسانی کاربر:', error);
      return false;
    }
  }
}

module.exports = Quiz; 