const ClickStats = require('../models/ClickStats');

// کنترلر برای ثبت کلیک جدید
exports.registerClick = async (req, res) => {
  try {
    const { itemType, itemId, itemName } = req.body;
    
    // بررسی پارامترهای ورودی
    if (!itemType || !itemId) {
      return res.status(400).json({ 
        success: false, 
        message: 'پارامترهای itemType و itemId الزامی هستند' 
      });
    }
    
    // ثبت کلیک در دیتابیس
    const success = await ClickStats.registerClick(itemType, itemId, itemName || '');
    
    if (success) {
      res.status(200).json({ 
        success: true, 
        message: 'کلیک با موفقیت ثبت شد' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'خطا در ثبت کلیک' 
      });
    }
  } catch (error) {
    console.error('خطا در ثبت کلیک:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در ثبت کلیک' 
    });
  }
};

// کنترلر برای دریافت آمار روزانه بر اساس نوع آیتم
exports.getDailyStats = async (req, res) => {
  try {
    const { itemType } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 30;
    
    if (!itemType) {
      return res.status(400).json({ 
        success: false, 
        message: 'پارامتر itemType الزامی است' 
      });
    }
    
    const stats = await ClickStats.getDailyStats(itemType, limit);
    
    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('خطا در دریافت آمار روزانه:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در دریافت آمار روزانه' 
    });
  }
};

// کنترلر برای دریافت آمار کلی بر اساس نوع آیتم
exports.getTotalStatsByType = async (req, res) => {
  try {
    const { itemType } = req.params;
    
    if (!itemType) {
      return res.status(400).json({ 
        success: false, 
        message: 'پارامتر itemType الزامی است' 
      });
    }
    
    const stats = await ClickStats.getTotalStatsByType(itemType);
    
    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('خطا در دریافت آمار کلی بر اساس نوع:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در دریافت آمار کلی' 
    });
  }
};

// کنترلر برای دریافت آمار کلی همه انواع
exports.getAllStats = async (req, res) => {
  try {
    const stats = await ClickStats.getAllStats();
    
    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('خطا در دریافت کل آمارها:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در دریافت کل آمارها' 
    });
  }
};

// کنترلر برای دریافت پربازدیدترین آیتم‌ها
exports.getTopItems = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    const items = await ClickStats.getTopItems(limit);
    
    res.status(200).json({ 
      success: true, 
      data: items 
    });
  } catch (error) {
    console.error('خطا در دریافت پربازدیدترین آیتم‌ها:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در دریافت پربازدیدترین آیتم‌ها' 
    });
  }
}; 