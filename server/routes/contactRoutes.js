const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// ثبت پیام جدید
router.post('/', contactController.createContact);

// دریافت تمام پیام‌ها
router.get('/', contactController.getAllContacts);

// علامت‌گذاری پیام به عنوان خوانده شده
router.put('/:id/read', contactController.markAsRead);

module.exports = router; 