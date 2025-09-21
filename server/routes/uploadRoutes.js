const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// آپلود تصویر
router.post('/image', uploadController.uploadMiddleware, uploadController.uploadImage);

// حذف تصویر
router.delete('/image/:filename', uploadController.deleteImage);

// لیست تصاویر
router.get('/images', uploadController.listImages);

module.exports = router;
