const mysql = require('mysql2/promise');
const { pool } = require('../config/db');

class Quiz2 {
  static async createQuiz(name, phone) {
    const query = 'INSERT INTO quiz2 (name, phone) VALUES (?, ?)';
    try {
      const [result] = await pool.execute(query, [name, phone]);
      return result.insertId;
    } catch (error) {
      console.error('خطا در ثبت کوییز:', error);
      throw error;
    }
  }

  static async saveQuizResults(quizId, answers) {
    const query = 'UPDATE quiz2 SET answers = ?, result = ? WHERE id = ?';
    try {
      const result = await pool.execute(query, [
        JSON.stringify(answers), 
        this.calculateResult(answers),
        quizId
      ]);
      return result;
    } catch (error) {
      console.error('خطا در ذخیره‌سازی نتایج کوییز:', error);
      throw error;
    }
  }

  static calculateResult(answers) {
    const counts = {
      A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0
    };

    answers.forEach(answer => {
      counts[answer]++;
    });

    const maxCount = Math.max(...Object.values(counts));
    const topAnswers = Object.keys(counts).filter(key => counts[key] === maxCount);

    const personalities = {
      A: '😴 خوابالو',
      B: '🤳 سلفی‌بگیر',
      C: '😒 غرغرو',
      D: '🍕 شکمو',
      E: '🐗 خروپف‌کن',
      F: '💸 خسیس',
      G: '👑 نازک‌نارنجی'
    };

    return personalities[topAnswers[0]] || personalities.A;
  }

  static async getQuizById(quizId) {
    const query = 'SELECT * FROM quiz2 WHERE id = ?';
    try {
      const [rows] = await pool.execute(query, [quizId]);
      return rows[0];
    } catch (error) {
      console.error('خطا در دریافت کوییز:', error);
      throw error;
    }
  }
}

module.exports = Quiz2; 