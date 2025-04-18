const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// مسیر برای افزودن کاربر جدید
router.post('/users', quizController.addUser);

// مسیر برای دریافت تمام کاربران
router.get('/users', quizController.getAllUsers);

// مسیر برای دریافت کاربر با شماره موبایل
router.get('/users/phone/:phone', quizController.getUserByPhone);

// مسیر برای به‌روزرسانی اطلاعات کاربر
router.put('/users/:id', quizController.updateUser);

module.exports = router; 