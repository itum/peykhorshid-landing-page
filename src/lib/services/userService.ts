import axios from 'axios';
import * as XLSX from 'xlsx';
import { sendSMSWithJSONP, sendSMSWithIframe } from './smsUtils';

// تعریف تایپ اطلاعات کاربر
export type UserInfo = {
  name: string;
  phone: string;
  quizAnswers: Record<string, any>;
  travelDestination?: string;
  score?: number;
  timestamp: string;
};

// آرایه برای نگهداری اطلاعات کاربران
let users: UserInfo[] = [];

// تلاش برای بارگیری اطلاعات کاربران از localStorage
const loadUsersFromLocalStorage = (): void => {
  try {
    const savedUsers = localStorage.getItem('travel_quiz_users');
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    }
  } catch (error) {
    console.error('خطا در بارگیری اطلاعات کاربران:', error);
  }
};

// ذخیره اطلاعات کاربران در localStorage
const saveUsersToLocalStorage = (): void => {
  try {
    localStorage.setItem('travel_quiz_users', JSON.stringify(users));
  } catch (error) {
    console.error('خطا در ذخیره اطلاعات کاربران:', error);
  }
};

// اجرای بارگیری اولیه
loadUsersFromLocalStorage();

// افزودن کاربر جدید
export const addUser = (user: Omit<UserInfo, 'timestamp'>): void => {
  const newUser: UserInfo = {
    ...user,
    timestamp: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsersToLocalStorage();
  
  // ذخیره در اکسل
  saveUsersToExcel();
};

// دریافت تمام کاربران
export const getUsers = (): UserInfo[] => {
  return users;
};

// تابع کمکی برای دانلود فایل اکسل
export const downloadExcel = (): void => {
  saveUsersToExcel(true);
};

// ذخیره اطلاعات کاربران در فایل اکسل
const saveUsersToExcel = (download = false): void => {
  try {
    // تبدیل اطلاعات به فرمت مناسب برای اکسل
    const excelData = users.map(user => ({
      'نام و نام خانوادگی': user.name || 'بدون نام',
      'شماره موبایل': user.phone,
      'مقصد سفر': user.travelDestination || '',
      'امتیاز': user.score || 0,
      'ترجیح سفر': user.quizAnswers.location || '',
      'فعالیت‌ها': Array.isArray(user.quizAnswers.activities) 
        ? user.quizAnswers.activities.join(', ') 
        : user.quizAnswers.activities || '',
      'مدت سفر': user.quizAnswers.duration || '',
      'فصل مورد علاقه': user.quizAnswers.season || '',
      'بودجه': user.quizAnswers.budget || '',
      'میزان ماجراجویی': user.quizAnswers.adventure || '',
      'تاریخ ثبت': new Date(user.timestamp).toLocaleString('fa-IR'),
    }));

    // ایجاد کتاب کار اکسل
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'کاربران');

    // اگر نیاز به دانلود باشد، فایل را دانلود می‌کنیم
    if (download) {
      XLSX.writeFile(workbook, 'travel_quiz_users.xlsx');
    } else {
      // ذخیره به صورت باینری و ارسال به سرور (در صورت نیاز)
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveExcelToServer(excelBuffer);
    }
  } catch (error) {
    console.error('خطا در ذخیره فایل اکسل:', error);
  }
};

// تابع برای ارسال فایل اکسل به سرور (در صورت نیاز)
const saveExcelToServer = (excelBuffer: ArrayBuffer): void => {
  // این تابع میتواند در صورتی که بخواهید فایل اکسل را به سرور ارسال کنید استفاده شود
  // در اینجا فقط یک نمونه قرار داده شده است
  
  /*
  const formData = new FormData();
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  formData.append('file', blob, 'travel_quiz_users.xlsx');
  
  axios.post('/api/upload-excel', formData)
    .then(response => console.log('فایل اکسل با موفقیت آپلود شد'))
    .catch(error => console.error('خطا در آپلود فایل اکسل:', error));
  */
};

// ارسال پیامک با سرویس کاوه نگار
export const sendSMS = async (phone: string, name: string): Promise<boolean> => {
  console.log('در حال ارسال پیامک به:', phone, 'با نام:', name);
  
  if (!phone || phone.trim() === '') {
    console.error('شماره موبایل وارد نشده است');
    return false;
  }
  
  const apiKey = '6F315959556279784174515954335870754D57582B446843686470686854336A';
  const template = 'Smsvorod';
  
  // ارسال با استفاده از الگو (پترن) به جای پیامک متنی
  const templateUrl = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${encodeURIComponent(phone)}&template=${encodeURIComponent(template)}&token=${encodeURIComponent(name || 'کاربر گرامی')}`;
  console.log('ارسال پیامک با الگو:', templateUrl);
  
  try {
    // روش تصویری ساده
    const img = document.createElement('img');
    img.style.display = 'none';
    img.src = templateUrl;
    document.body.appendChild(img);
    
    // حذف عنصر بعد از مدتی
    setTimeout(() => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    }, 5000);
    
    return true;
  } catch (error) {
    console.error('خطا در ارسال پیامک با الگو:', error);
    return false;
  }
};

// تابع جایگزین برای ارسال پیامک با استفاده از API متنی
export const sendSMSAlternative = async (phone: string, name: string): Promise<boolean> => {
  console.log('ارسال پیامک با الگو به:', phone, 'با نام:', name);
  
  if (!phone || phone.trim() === '') {
    console.error('شماره موبایل وارد نشده است');
    return false;
  }
  
  const apiKey = '6F315959556279784174515954335870754D57582B446843686470686854336A';
  const template = 'Smsvorod';
  
  // استفاده از الگو (پترن) کاوه نگار
  const templateUrl = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${encodeURIComponent(phone)}&template=${encodeURIComponent(template)}&token=${encodeURIComponent(name || 'کاربر گرامی')}`;
  
  // روش JSONP
  try {
    const script = document.createElement('script');
    const callbackName = `jsonpCallback_${Date.now()}`;
    let timeout: number | null = null;
    
    return new Promise((resolve) => {
      (window as any)[callbackName] = (data: any) => {
        console.log('پاسخ JSONP برای ارسال پیامک الگو:', data);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (timeout) {
          clearTimeout(timeout);
        }
        delete (window as any)[callbackName];
        resolve(true);
      };
      
      script.src = `${templateUrl}&callback=${callbackName}`;
      document.head.appendChild(script);
      
      // تایم اوت برای حذف اسکریپت در صورت عدم پاسخ
      timeout = window.setTimeout(() => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as any)[callbackName];
        resolve(false);
      }, 5000);
    });
  } catch (error) {
    console.error('خطا در ارسال پیامک الگو با JSONP:', error);
    
    // روش پشتیبان با عنصر تصویری
    try {
      const img = document.createElement('img');
      img.style.display = 'none';
      img.src = templateUrl;
      document.body.appendChild(img);
      
      // حذف عنصر بعد از مدتی
      setTimeout(() => {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
      }, 5000);
      
      return true;
    } catch (imgError) {
      console.error('خطا در روش تصویری:', imgError);
      return false;
    }
  }
}; 