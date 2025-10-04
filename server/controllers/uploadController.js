const multer = require('multer');
const path = require('path');
const fs = require('fs');

// تنظیمات multer برای آپلود فایل
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/images');
    // ایجاد پوشه اگر وجود نداشته باشد
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // تولید نام فایل منحصر به فرد
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// فیلتر فایل‌ها
const fileFilter = (req, file, cb) => {
  // فقط تصاویر را قبول کن (شامل SVG)
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowedMime = allowedMimes.includes(file.mimetype);
  const isAllowedExt = allowedExts.includes(ext);
  
  if (isAllowedMime && isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری (PNG, JPG, JPEG, GIF, WEBP, SVG) مجاز هستند!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// آپلود تصویر
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'هیچ فایلی آپلود نشده است' 
      });
    }

    // استفاده از BASE_URL از متغیر محیطی
    const baseUrl = process.env.BASE_URL;
    
    if (!baseUrl) {
      return res.status(500).json({ 
        success: false, 
        message: 'BASE_URL در متغیرهای محیطی تنظیم نشده است' 
      });
    }
    
    const imageUrl = `${baseUrl}/uploads/images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'تصویر با موفقیت آپلود شد',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('خطا در آپلود تصویر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در آپلود تصویر' 
    });
  }
};

// حذف تصویر
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '../uploads/images', filename);
    
    // بررسی وجود فایل
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.json({
        success: true,
        message: 'تصویر با موفقیت حذف شد'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'تصویر یافت نشد'
      });
    }
  } catch (error) {
    console.error('خطا در حذف تصویر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در حذف تصویر' 
    });
  }
};

// لیست تصاویر
exports.listImages = async (req, res) => {
  try {
    const imagesPath = path.join(__dirname, '../uploads/images');
    
    if (!fs.existsSync(imagesPath)) {
      return res.json({
        success: true,
        data: []
      });
    }

    // استفاده از BASE_URL از متغیر محیطی
    const baseUrl = process.env.BASE_URL;
    
    if (!baseUrl) {
      return res.status(500).json({ 
        success: false, 
        message: 'BASE_URL در متغیرهای محیطی تنظیم نشده است' 
      });
    }

    const files = fs.readdirSync(imagesPath);
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      })
      .map(file => ({
        filename: file,
        url: `${baseUrl}/uploads/images/${file}`,
        path: path.join(imagesPath, file),
        size: fs.statSync(path.join(imagesPath, file)).size,
        created: fs.statSync(path.join(imagesPath, file)).birthtime
      }))
      .sort((a, b) => b.created - a.created);

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('خطا در لیست تصاویر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطا در دریافت لیست تصاویر' 
    });
  }
};

// middleware برای آپلود
exports.uploadMiddleware = upload.single('image');
