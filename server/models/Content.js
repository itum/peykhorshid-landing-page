const { pool } = require('../config/db');

class Content {
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contents (
          id INT PRIMARY KEY AUTO_INCREMENT,
          page VARCHAR(100) NOT NULL,
          section_key VARCHAR(100) NOT NULL,
          title VARCHAR(255) DEFAULT NULL,
          data JSON NULL,
          sort_order INT DEFAULT 0,
          is_active TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_page_section (page, section_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await connection.query(createTableQuery);
      connection.release();
      console.log('جدول contents با موفقیت ایجاد شد یا از قبل وجود داشت.');
      return true;
    } catch (error) {
      console.error('خطا در ایجاد جدول contents:', error);
      return false;
    }
  }

  static async list({ page } = {}) {
    const connection = await pool.getConnection();
    try {
      const where = page ? 'WHERE page = ?' : '';
      const params = page ? [page] : [];
      const [rows] = await connection.query(
        `SELECT * FROM contents ${where} ORDER BY page, sort_order, id DESC`,
        params
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async getByKey(page, sectionKey) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM contents WHERE page = ? AND section_key = ? LIMIT 1',
        [page, sectionKey]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  static async create({ page, section_key, title, data, sort_order = 0, is_active = 1 }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO contents (page, section_key, title, data, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [page, section_key, title || null, JSON.stringify(data || {}), sort_order, is_active]
      );
      return { id: result.insertId };
    } finally {
      connection.release();
    }
  }

  static async update(id, { page, section_key, title, data, sort_order, is_active }) {
    const connection = await pool.getConnection();
    try {
      const fields = [];
      const params = [];
      if (page !== undefined) { fields.push('page = ?'); params.push(page); }
      if (section_key !== undefined) { fields.push('section_key = ?'); params.push(section_key); }
      if (title !== undefined) { fields.push('title = ?'); params.push(title); }
      if (data !== undefined) { fields.push('data = ?'); params.push(JSON.stringify(data)); }
      if (sort_order !== undefined) { fields.push('sort_order = ?'); params.push(sort_order); }
      if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active); }

      if (fields.length === 0) return false;

      params.push(id);
      const [result] = await connection.query(
        `UPDATE contents SET ${fields.join(', ')} WHERE id = ?`,
        params
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async remove(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('DELETE FROM contents WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM contents ORDER BY page, sort_order, id'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async clearAll() {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM contents');
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = Content;


