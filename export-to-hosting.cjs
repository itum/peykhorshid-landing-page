#!/usr/bin/env node

// اسکریپت export داده‌ها برای هاست
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// تنظیمات دیتابیس
const connection = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'peykkhorshid',
  port: 3308
};

async function exportData() {
  try {
    console.log('🚀 شروع export داده‌ها...');
    
    // اتصال به دیتابیس
    const conn = await mysql.createConnection(connection);
    console.log('✅ اتصال به دیتابیس برقرار شد');

    // دریافت همه داده‌ها از جدول contents
    const [contents] = await conn.execute(`
      SELECT page, section_key, title, data, sort_order, is_active 
      FROM contents 
      ORDER BY sort_order
    `);

    console.log(`📊 ${contents.length} رکورد پیدا شد`);

    // ایجاد فایل JSON
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      contents: contents.map(row => ({
        page: row.page,
        section_key: row.section_key,
        title: row.title,
        data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
        sort_order: row.sort_order,
        is_active: row.is_active
      }))
    };

    // ذخیره فایل JSON
    const jsonPath = path.join(__dirname, 'exported-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf8');
    console.log(`💾 فایل JSON ایجاد شد: ${jsonPath}`);

    // ایجاد فایل SQL
    const sqlPath = path.join(__dirname, 'exported-data.sql');
    let sqlContent = `-- Export داده‌های Peyk Khorshid\n`;
    sqlContent += `-- تاریخ: ${new Date().toLocaleString('fa-IR')}\n\n`;
    
    sqlContent += `-- حذف جدول موجود (اختیاری)\n`;
    sqlContent += `-- DROP TABLE IF EXISTS contents;\n\n`;
    
    sqlContent += `-- ایجاد جدول\n`;
    sqlContent += `CREATE TABLE IF NOT EXISTS contents (
  id int(11) NOT NULL AUTO_INCREMENT,
  page varchar(50) NOT NULL,
  section_key varchar(100) NOT NULL,
  title varchar(255) DEFAULT NULL,
  data longtext,
  sort_order int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_page_section (page,section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    // اضافه کردن داده‌ها
    contents.forEach((row, index) => {
      const dataStr = typeof row.data === 'string' ? row.data : JSON.stringify(row.data);
      sqlContent += `INSERT INTO contents (page, section_key, title, data, sort_order, is_active) VALUES (`;
      sqlContent += `'${row.page}', `;
      sqlContent += `'${row.section_key}', `;
      sqlContent += `'${row.title}', `;
      sqlContent += `'${dataStr.replace(/'/g, "\\'")}', `;
      sqlContent += `${row.sort_order}, `;
      sqlContent += `${row.is_active}`;
      sqlContent += `);\n`;
    });

    fs.writeFileSync(sqlPath, sqlContent, 'utf8');
    console.log(`💾 فایل SQL ایجاد شد: ${sqlPath}`);

    // ایجاد گزارش
    const reportPath = path.join(__dirname, 'export-report.md');
    let report = `# گزارش Export داده‌ها\n\n`;
    report += `**تاریخ:** ${new Date().toLocaleString('fa-IR')}\n\n`;
    report += `**تعداد رکوردها:** ${contents.length}\n\n`;
    report += `## لیست داده‌ها:\n\n`;
    
    contents.forEach((row, index) => {
      report += `${index + 1}. **${row.page}/${row.section_key}** - ${row.title}\n`;
    });

    report += `\n## فایل‌های ایجاد شده:\n\n`;
    report += `- \`exported-data.json\` - داده‌ها در فرمت JSON\n`;
    report += `- \`exported-data.sql\` - دستورات SQL برای import\n`;
    report += `- \`export-report.md\` - این گزارش\n\n`;
    report += `## نحوه استفاده در هاست:\n\n`;
    report += `1. فایل \`exported-data.sql\` را در phpMyAdmin یا MySQL client اجرا کنید\n`;
    report += `2. یا از فایل \`exported-data.json\` برای import برنامه‌ای استفاده کنید\n\n`;

    fs.writeFileSync(reportPath, report, 'utf8');
    console.log(`📋 گزارش ایجاد شد: ${reportPath}`);

    await conn.end();
    console.log('✅ Export با موفقیت انجام شد!');
    console.log('\n📁 فایل‌های ایجاد شده:');
    console.log(`   - ${jsonPath}`);
    console.log(`   - ${sqlPath}`);
    console.log(`   - ${reportPath}`);

  } catch (error) {
    console.error('❌ خطا در export:', error.message);
    process.exit(1);
  }
}

// اجرای اسکریپت
exportData();
