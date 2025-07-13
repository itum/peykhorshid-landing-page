const Quiz = require('../models/Quiz');
const Quiz2 = require('../models/Quiz2');

// کنترلر برای افزودن کاربر جدید
exports.addUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // بررسی وجود شماره موبایل
    if (!userData.phone || userData.phone.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'شماره موبایل الزامی است' 
      });
    }
    
    // بررسی وجود پاسخ‌های کوییز
    if (!userData.quizAnswers) {
      return res.status(400).json({ 
        success: false, 
        message: 'پاسخ‌های کوییز ارسال نشده است' 
      });
    }
    
    // افزودن کاربر به دیتابیس
    const userId = await Quiz.addUser(userData);
    
    if (userId) {
      res.status(201).json({ 
        success: true, 
        message: 'اطلاعات کاربر با موفقیت ذخیره شد', 
        userId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'خطا در ذخیره اطلاعات کاربر' 
      });
    }
  } catch (error) {
    console.error('خطا در افزودن کاربر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در ذخیره اطلاعات' 
    });
  }
};

// کنترلر برای دریافت تمام کاربران
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Quiz.getAllUsers();
    res.status(200).json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    console.error('خطا در دریافت کاربران:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در دریافت اطلاعات کاربران' 
    });
  }
};

// کنترلر برای دریافت کاربر با شماره موبایل
exports.getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'شماره موبایل الزامی است' 
      });
    }
    
    const user = await Quiz.getUserByPhone(phone);
    
    if (user) {
      res.status(200).json({ 
        success: true, 
        data: user 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'کاربر با این شماره موبایل یافت نشد' 
      });
    }
  } catch (error) {
    console.error('خطا در دریافت کاربر با شماره موبایل:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در دریافت اطلاعات کاربر' 
    });
  }
};

// کنترلر برای به‌روزرسانی اطلاعات کاربر
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'شناسه کاربر الزامی است' 
      });
    }
    
    // بررسی وجود پاسخ‌های کوییز
    if (!userData.quizAnswers) {
      return res.status(400).json({ 
        success: false, 
        message: 'پاسخ‌های کوییز ارسال نشده است' 
      });
    }
    
    const success = await Quiz.updateUser(id, userData);
    
    if (success) {
      res.status(200).json({ 
        success: true, 
        message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'کاربر با این شناسه یافت نشد یا به‌روزرسانی ناموفق بود' 
      });
    }
  } catch (error) {
    console.error('خطا در به‌روزرسانی کاربر:', error);
    res.status(500).json({ 
      success: false, 
      message: 'خطای سرور در به‌روزرسانی اطلاعات کاربر' 
    });
  }
}; 

exports.createQuiz2 = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    // اعتبارسنجی اطلاعات ورودی
    if (!name || !phone) {
      return res.status(400).json({ 
        message: 'نام و شماره موبایل الزامی است' 
      });
    }

    // ایجاد کوییز جدید
    const quizId = await Quiz2.createQuiz(name, phone);

    res.status(201).json({ 
      message: 'کوییز با موفقیت ایجاد شد',
      quizId 
    });
  } catch (error) {
    console.error('خطا در ایجاد کوییز:', error);
    res.status(500).json({ 
      message: 'خطا در ایجاد کوییز',
      error: error.message 
    });
  }
};

exports.submitQuiz2 = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    
    // اعتبارسنجی اطلاعات ورودی
    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        message: 'اطلاعات نامعتبر' 
      });
    }

    // بررسی وجود کوییز
    const existingQuiz = await Quiz2.getQuizById(quizId);
    if (!existingQuiz) {
      return res.status(404).json({ 
        message: 'کوییز یافت نشد' 
      });
    }

    // ذخیره نتایج کوییز
    await Quiz2.saveQuizResults(quizId, answers);

    // محاسبه نتیجه نهایی
    const result = Quiz2.calculateResult(answers);

    res.status(200).json({ 
      message: 'نتایج کوییز با موفقیت ثبت شد',
      result 
    });
  } catch (error) {
    console.error('خطا در ثبت نتایج کوییز:', error);
    res.status(500).json({ 
      message: 'خطا در ثبت نتایج کوییز',
      error: error.message 
    });
  }
}; 

exports.getAllQuiz2Users = async (req, res) => {
  try {
    const users = await Quiz2.getAll();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('خطا در دریافت کاربران کوییز 2:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت اطلاعات کاربران کوییز 2'
    });
  }
}; 