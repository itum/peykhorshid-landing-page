const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection } = require('./config/db');
const Quiz = require('./models/Quiz');
const Contact = require('./models/Contact');
const ClickStats = require('./models/ClickStats');
const Quiz2 = require('./models/Quiz2');
const Content = require('./models/Content');
const quizRoutes = require('./routes/quizRoutes');
const contactRoutes = require('./routes/contactRoutes');
const statsRoutes = require('./routes/statsRoutes');
const contentRoutes = require('./routes/contentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// تنظیمات اولیه برنامه
const app = express();
const PORT = process.env.PORT || 3001;

// middleware ها
app.use(cors({
  origin: '*', // اجازه دسترسی از همه دامنه‌ها
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// تنظیم مسیرهای API
app.use('/api/quiz', quizRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

// مسیر اصلی
app.get('/', (req, res) => {
  res.json({ message: 'به سرور پیک خورشید خوش آمدید!' });
});

// راه‌اندازی سرور
const startServer = async () => {
  try {
    // تست اتصال به دیتابیس
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('اتصال به دیتابیس برقرار نشد. برنامه متوقف می‌شود.');
      process.exit(1);
    }
    
    // ایجاد جدول‌های مورد نیاز در صورت عدم وجود
    await Quiz.createTable();
    await Contact.createTable();
    await ClickStats.createTable();
    await Quiz2.createTable();
    await Content.createTable();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`سرور با موفقیت در پورت ${PORT} راه‌اندازی شد.`);
      console.log(`آدرس: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('خطا در راه‌اندازی سرور:', error);
    process.exit(1);
  }
};

// شروع سرور
startServer(); 