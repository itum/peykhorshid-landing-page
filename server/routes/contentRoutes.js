const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// لیست محتوا با فیلتر صفحه
router.get('/', contentController.list);

// دریافت یک سکشن بر اساس page و sectionKey
router.get('/:page/:sectionKey', contentController.getByKey);

// ایجاد
router.post('/', contentController.create);

// به‌روزرسانی
router.put('/:id', contentController.update);

// حذف
router.delete('/:id', contentController.remove);

// بکاپ کامل محتوا
router.get('/backup', contentController.backup);

// ریستور محتوا
router.post('/restore', contentController.restore);

module.exports = router;


