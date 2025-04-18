const Contact = require('../models/Contact');

// ثبت پیام جدید تماس با ما
exports.createContact = async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    
    // اعتبارسنجی داده‌های ورودی
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'لطفاً تمام فیلدهای مورد نیاز را تکمیل کنید.'
      });
    }
    
    // ذخیره پیام در دیتابیس
    const contact = await Contact.create({ name, phone, message });
    
    res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ثبت شد.',
      data: contact
    });
  } catch (error) {
    console.error('خطا در ثبت پیام:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت پیام. لطفاً دوباره تلاش کنید.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// دریافت تمام پیام‌های تماس با ما
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAll();
    
    res.status(200).json({
      success: true,
      message: 'پیام‌های تماس با ما با موفقیت دریافت شدند.',
      data: contacts
    });
  } catch (error) {
    console.error('خطا در دریافت پیام‌ها:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیام‌ها. لطفاً دوباره تلاش کنید.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// علامت‌گذاری پیام به عنوان خوانده شده
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Contact.markAsRead(id);
    
    res.status(200).json({
      success: true,
      message: 'پیام با موفقیت به عنوان خوانده شده علامت‌گذاری شد.'
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی وضعیت پیام:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت پیام. لطفاً دوباره تلاش کنید.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 