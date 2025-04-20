const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// ثبت کلیک جدید
router.post('/click', statsController.registerClick);

// دریافت آمار روزانه بر اساس نوع آیتم
router.get('/daily/:itemType', statsController.getDailyStats);

// دریافت آمار کلی بر اساس نوع آیتم
router.get('/total/:itemType', statsController.getTotalStatsByType);

// دریافت آمار کلی همه انواع
router.get('/all', statsController.getAllStats);

// دریافت پربازدیدترین آیتم‌ها
router.get('/top', statsController.getTopItems);

module.exports = router; 