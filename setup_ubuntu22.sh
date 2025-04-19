#!/bin/bash

# رنگ ها برای خروجی بهتر
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # بدون رنگ

# تابع برای نمایش پیام ها
print_message() {
    echo -e "${GREEN}>>> $1${NC}"
}

print_error() {
    echo -e "${RED}!!! $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}*** $1${NC}"
}

# تابع تولید رمز عبور تصادفی
generate_password() {
    length=$1
    [ -z "$length" ] && length=16
    tr -dc 'A-Za-z0-9_!@#$%^&*()-+=' < /dev/urandom | head -c $length
}

# ایجاد نام کاربری و رمز عبور تصادفی
MYSQL_USERNAME="user_$(tr -dc 'a-z0-9' < /dev/urandom | head -c 8)"
MYSQL_PASSWORD=$(generate_password 20)
PHPMYADMIN_PASSWORD=$(generate_password 20)
ROOT_PASSWORD=$(generate_password 20)

# ذخیره اطلاعات در فایل
cat > mysql_credentials.txt << EOF
# اطلاعات کاربری دیتابیس
نام کاربری برنامه: $MYSQL_USERNAME
رمز عبور برنامه: $MYSQL_PASSWORD
رمز عبور phpMyAdmin: $PHPMYADMIN_PASSWORD
رمز عبور root: $ROOT_PASSWORD

# تاریخ ایجاد: $(date)
EOF

print_warning "اطلاعات کاربری دیتابیس در فایل mysql_credentials.txt ذخیره شد."
print_warning "این فایل را در مکانی امن نگهداری کنید."

# بررسی اجرا با دسترسی روت
if [ "$EUID" -ne 0 ]; then
    print_error "لطفا اسکریپت را با دسترسی روت اجرا کنید (sudo)"
    exit 1
fi

# بروزرسانی سیستم
print_message "بروزرسانی لیست بسته ها..."
apt update
apt upgrade -y

# نصب ابزارهای پایه
print_message "نصب ابزارهای پایه..."
apt install -y curl wget git build-essential apt-transport-https ca-certificates gnupg expect

# نصب و پیکربندی MySQL
print_message "نصب MySQL..."
apt install -y mysql-server

# تنظیم رمز root به صورت خودکار
print_message "تنظیم رمز عبور root برای MySQL..."
mysql --user=root <<_EOF_
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$ROOT_PASSWORD';
FLUSH PRIVILEGES;
_EOF_

# اجرای mysql_secure_installation به صورت خودکار با expect
print_message "پیکربندی امنیت MySQL..."
expect -f - <<EOF
spawn mysql_secure_installation

expect "Enter password for user root:"
send "$ROOT_PASSWORD\r"

expect "Press y|Y for Yes, any other key for No:"
send "y\r"

expect "Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG:"
send "2\r"

expect "Change the password for root ? (Press y|Y for Yes, any other key for No) :"
send "n\r"

expect "Remove anonymous users? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect "Disallow root login remotely? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect "Remove test database and access to it? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect "Reload privilege tables now? (Press y|Y for Yes, any other key for No) :"
send "y\r"

expect eof
EOF

# فعال‌سازی MySQL در هنگام راه‌اندازی
print_message "فعال‌سازی سرویس MySQL..."
systemctl enable mysql
systemctl start mysql

# نصب phpMyAdmin
print_message "نصب phpMyAdmin..."
apt install -y phpmyadmin php-mbstring php-zip php-gd php-json php-curl

# نصب وب سرور Apache اگر انتخاب نشده باشد
print_message "بررسی و نصب Apache..."
if ! dpkg -l | grep -q apache2; then
    apt install -y apache2
    systemctl enable apache2
    systemctl start apache2
fi

# فعال‌سازی مجددا Apache
print_message "راه‌اندازی مجدد Apache..."
systemctl restart apache2

# ایجاد کاربر MySQL برای phpMyAdmin
print_message "ایجاد کاربر MySQL برای phpMyAdmin..."
mysql -u root -p$ROOT_PASSWORD <<EOF
CREATE USER 'phpmyadmin'@'localhost' IDENTIFIED BY '$PHPMYADMIN_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'phpmyadmin'@'localhost' WITH GRANT OPTION;
CREATE USER '$MYSQL_USERNAME'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USERNAME'@'localhost';
FLUSH PRIVILEGES;
EOF

# نصب Node.js
print_message "نصب Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# بررسی نسخه Node.js و npm
print_message "بررسی نسخه های نصب شده..."
node -v
npm -v

# نصب بسته های عمومی Node.js
print_message "نصب بسته های عمومی Node.js..."
npm install -g npm@latest
npm install -g nodemon pm2 yarn

# نصب Express.js
print_message "ایجاد پروژه نمونه Express.js..."
mkdir -p /opt/expressapp
cd /opt/expressapp

# ایجاد پروژه Express.js نمونه
cat > package.json << EOF
{
  "name": "expressapp",
  "version": "1.0.0",
  "description": "Express.js Application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
EOF

# ایجاد فایل اصلی برنامه
cat > app.js << EOF
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// میدلور‌ها
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسیر استاتیک برای فایل‌های فرانت‌اند
app.use(express.static(path.join(__dirname, 'public')));

// مسیر سلام دنیا
app.get('/api/hello', (req, res) => {
  res.json({ message: 'سلام دنیا!' });
});

// صفحه اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(\`سرور در پورت \${PORT} در حال اجرا است\`);
});
EOF

# ایجاد فایل .env
cat > .env << EOF
PORT=3000
DB_HOST=localhost
DB_USER=$MYSQL_USERNAME
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=mydb
EOF

# ایجاد پوشه public و فایل index.html
mkdir -p public
cat > public/index.html << EOF
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اپلیکیشن Express.js</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2c3e50;
        }
        .btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }
        #result {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>به اپلیکیشن Express.js خوش آمدید</h1>
        <p>این یک اپلیکیشن نمونه است که با Express.js ساخته شده است.</p>
        
        <button class="btn" id="testApi">تست API</button>
        
        <div id="result"></div>
    </div>

    <script>
        document.getElementById('testApi').addEventListener('click', async () => {
            try {
                const response = await fetch('/api/hello');
                const data = await response.json();
                document.getElementById('result').innerText = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').innerText = 'خطا: ' + error.message;
            }
        });
    </script>
</body>
</html>
EOF

# نصب وابستگی‌های پروژه
print_message "نصب وابستگی‌های Express.js..."
npm install

# ایجاد اسکریپت برای ایمپورت دیتابیس
print_message "ایجاد اسکریپت برای ایمپورت دیتابیس..."
cat > import_database.sh << EOF
#!/bin/bash

# این اسکریپت برای ایمپورت دیتابیس استفاده می‌شود
# برای استفاده: ./import_database.sh path/to/your/database.sql

if [ -z "\$1" ]; then
    echo "لطفا مسیر فایل SQL را وارد کنید"
    echo "مثال: ./import_database.sh path/to/your/database.sql"
    exit 1
fi

# ایجاد دیتابیس
echo "در حال ایجاد دیتابیس..."
mysql -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# ایمپورت دیتابیس
echo "در حال ایمپورت دیتابیس..."
mysql -u $MYSQL_USERNAME -p$MYSQL_PASSWORD mydb < "\$1"

echo "ایمپورت دیتابیس با موفقیت انجام شد"
EOF

chmod +x import_database.sh

# راه‌اندازی اپلیکیشن با PM2
print_message "راه‌اندازی اپلیکیشن با PM2..."
pm2 start app.js --name "expressapp"
pm2 save
pm2 startup

# نمایش اطلاعات نصب
print_message "نصب و پیکربندی با موفقیت انجام شد!"
echo ""
echo "🔹 MySQL و phpMyAdmin نصب شدند"
echo "🔹 اطلاعات کاربری:"
echo "  🔸 نام کاربری برنامه: $MYSQL_USERNAME"
echo "  🔸 رمز عبور برنامه: $MYSQL_PASSWORD"
echo "  🔸 نام کاربری phpMyAdmin: phpmyadmin"
echo "  🔸 رمز عبور phpMyAdmin: $PHPMYADMIN_PASSWORD"
echo "  🔸 رمز عبور root: $ROOT_PASSWORD"
echo ""
echo "🔹 اطلاعات کاربری در فایل mysql_credentials.txt ذخیره شده است"
echo "🔹 phpMyAdmin: http://your-server-ip/phpmyadmin"
echo "🔹 Node.js $(node -v) و npm $(npm -v) نصب شدند"
echo "🔹 اپلیکیشن Express.js در /opt/expressapp ایجاد شد"
echo "🔹 اپلیکیشن در پورت 3000 اجرا می‌شود: http://your-server-ip:3000"
echo "🔹 برای ایمپورت دیتابیس از اسکریپت زیر استفاده کنید:"
echo "   cd /opt/expressapp && ./import_database.sh path/to/your/database.sql"
echo ""
echo "🔸 دستور نمایش وضعیت اپلیکیشن: pm2 status"
echo "🔸 دستور راه‌اندازی مجدد: pm2 restart expressapp"
echo "🔸 دستور مشاهده لاگ‌ها: pm2 logs expressapp" 