const Content = require('../models/Content');

exports.createTable = async () => {
  return Content.createTable();
};

exports.list = async (req, res) => {
  try {
    const page = req.query.page;
    const rows = await Content.list({ page });
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('خطا در لیست محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
};

exports.getByKey = async (req, res) => {
  try {
    const { page, sectionKey } = req.params;
    const row = await Content.getByKey(page, sectionKey);
    if (!row) return res.status(404).json({ success: false, message: 'یافت نشد' });
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('خطا در دریافت محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.page || !payload.section_key) {
      return res.status(400).json({ success: false, message: 'page و section_key الزامی است' });
    }
    const result = await Content.create(payload);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('خطا در ایجاد محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Content.update(id, req.body || {});
    if (!ok) return res.status(404).json({ success: false, message: 'به‌روزرسانی انجام نشد' });
    res.json({ success: true });
  } catch (error) {
    console.error('خطا در به‌روزرسانی محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Content.remove(id);
    if (!ok) return res.status(404).json({ success: false, message: 'حذف انجام نشد' });
    res.json({ success: true });
  } catch (error) {
    console.error('خطا در حذف محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
};

// بکاپ کامل محتوا
exports.backup = async (req, res) => {
  try {
    const allContent = await Content.getAll();
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      content: allContent
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="content-backup-${new Date().toISOString().split('T')[0]}.json"`);
    res.json(backupData);
  } catch (error) {
    console.error('خطا در بکاپ محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در بکاپ' });
  }
};

// ریستور محتوا
exports.restore = async (req, res) => {
  try {
    const { backupData } = req.body;
    
    if (!backupData || !backupData.content || !Array.isArray(backupData.content)) {
      return res.status(400).json({ success: false, message: 'فرمت فایل بکاپ نامعتبر است' });
    }

    // حذف تمام محتوای موجود
    await Content.clearAll();
    
    // بازگردانی محتوا از بکاپ
    let restoredCount = 0;
    for (const item of backupData.content) {
      try {
        await Content.create(item);
        restoredCount++;
      } catch (error) {
        console.error('خطا در بازگردانی آیتم:', error);
      }
    }
    
    res.json({ 
      success: true, 
      message: `${restoredCount} آیتم با موفقیت بازگردانی شد`,
      restoredCount 
    });
  } catch (error) {
    console.error('خطا در ریستور محتوا:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در ریستور' });
  }
};


