const { pool } = require('../config/db');

class ClickStats {
  // ایجاد جدول click_stats اگر وجود نداشته باشد
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS click_stats (
          id INT PRIMARY KEY AUTO_INCREMENT,
          item_type VARCHAR(50) NOT NULL,
          item_id VARCHAR(100) NOT NULL,
          item_name VARCHAR(255),
          click_date DATE NOT NULL,
          click_count INT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      
      await connection.query(createTableQuery);
      console.log('جدول click_stats با موفقیت ایجاد شد یا از قبل وجود داشت.');
      connection.release();
      return true;
    } catch (error) {
      console.error('خطا در ایجاد جدول click_stats:', error);
      return false;
    }
  }

  // ثبت کلیک جدید یا افزایش تعداد کلیک
  static async registerClick(itemType, itemId, itemName = '') {
    try {
      const connection = await pool.getConnection();
      const today = new Date().toISOString().split('T')[0]; // فرمت YYYY-MM-DD
      
      // بررسی آیا رکورد برای این آیتم و تاریخ وجود دارد
      const [existingRecord] = await connection.query(
        'SELECT * FROM click_stats WHERE item_type = ? AND item_id = ? AND click_date = ?',
        [itemType, itemId, today]
      );
      
      if (existingRecord.length > 0) {
        // اگر رکورد وجود دارد، افزایش تعداد کلیک
        await connection.query(
          'UPDATE click_stats SET click_count = click_count + 1 WHERE id = ?',
          [existingRecord[0].id]
        );
      } else {
        // اگر رکورد وجود ندارد، ایجاد رکورد جدید
        await connection.query(
          'INSERT INTO click_stats (item_type, item_id, item_name, click_date) VALUES (?, ?, ?, ?)',
          [itemType, itemId, itemName, today]
        );
      }
      
      connection.release();
      return true;
    } catch (error) {
      console.error('خطا در ثبت کلیک:', error);
      return false;
    }
  }

  // دریافت آمار روزانه بر اساس نوع آیتم
  static async getDailyStats(itemType, limit = 30) {
    try {
      const connection = await pool.getConnection();
      const query = `
        SELECT click_date, SUM(click_count) as total_clicks
        FROM click_stats
        WHERE item_type = ?
        GROUP BY click_date
        ORDER BY click_date DESC
        LIMIT ?
      `;
      
      const [rows] = await connection.query(query, [itemType, limit]);
      connection.release();
      return rows;
    } catch (error) {
      console.error('خطا در دریافت آمار روزانه:', error);
      return [];
    }
  }

  // دریافت آمار کلی بر اساس نوع آیتم
  static async getTotalStatsByType(itemType) {
    try {
      const connection = await pool.getConnection();
      const query = `
        SELECT item_id, item_name, SUM(click_count) as total_clicks
        FROM click_stats
        WHERE item_type = ?
        GROUP BY item_id, item_name
        ORDER BY total_clicks DESC
      `;
      
      const [rows] = await connection.query(query, [itemType]);
      connection.release();
      return rows;
    } catch (error) {
      console.error('خطا در دریافت آمار کلی بر اساس نوع:', error);
      return [];
    }
  }

  // دریافت آمار کلی همه انواع
  static async getAllStats() {
    try {
      const connection = await pool.getConnection();
      const query = `
        SELECT item_type, SUM(click_count) as total_clicks
        FROM click_stats
        GROUP BY item_type
        ORDER BY total_clicks DESC
      `;
      
      const [rows] = await connection.query(query);
      connection.release();
      return rows;
    } catch (error) {
      console.error('خطا در دریافت کل آمارها:', error);
      return [];
    }
  }

  // دریافت پربازدیدترین آیتم‌ها (همه انواع)
  static async getTopItems(limit = 100) {
    try {
      const connection = await pool.getConnection();
      const query = `
        SELECT item_type, item_id, item_name, SUM(click_count) as total_clicks
        FROM click_stats
        GROUP BY item_type, item_id, item_name
        ORDER BY total_clicks DESC
        LIMIT ?
      `;
      
      const [rows] = await connection.query(query, [limit]);
      connection.release();
      return rows;
    } catch (error) {
      console.error('خطا در دریافت پربازدیدترین آیتم‌ها:', error);
      return [];
    }
  }
}

module.exports = ClickStats; 