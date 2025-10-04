import axios from 'axios';
import ExcelJS from 'exceljs';
import { sendSMSWithJSONP, sendSMSWithIframe } from './smsUtils';
import { getApiUrl } from '@/lib/config/environment';

// آدرس API سرور
const API_URL = getApiUrl('api/quiz');

// تعریف تایپ اطلاعات کاربر
export type UserInfo = {
  name: string;
  phone: string;
  quizAnswers: Record<string, any>;
  travelDestination?: string;
  travel_destination?: string; // فیلد از دیتابیس
  score?: number;
  timestamp: string;
  created_at?: string; // فیلد از دیتابیس
  location?: string; // ترجیح سفر - فیلد از دیتابیس
  activities?: string; // فعالیت‌ها - فیلد از دیتابیس
  duration?: string; // مدت سفر - فیلد از دیتابیس
  season?: string; // فصل - فیلد از دیتابیس
  budget?: string; // بودجه - فیلد از دیتابیس
  adventure?: string; // ماجراجویی - فیلد از دیتابیس
};

export type Quiz2User = {
  id: number;
  name: string;
  phone: string;
  answers: string; // این جیسون است که به صورت رشته ذخیره شده
  result: string;
  created_at: string;
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
export const addUser = async (user: Omit<UserInfo, 'timestamp'>): Promise<void> => {
  const newUser: UserInfo = {
    ...user,
    timestamp: new Date().toISOString(),
  };
  
  // ذخیره در localStorage
  users.push(newUser);
  saveUsersToLocalStorage();
  
  // ذخیره در اکسل
  saveUsersToExcel();
  
  // ارسال به سرور
  try {
    await axios.post(`${API_URL}/users`, newUser);
    console.log('اطلاعات کاربر با موفقیت در سرور ثبت شد');
  } catch (error) {
    console.error('خطا در ارسال اطلاعات کاربر به سرور:', error);
  }
};

// دریافت تمام کاربران
export const getUsers = async (): Promise<UserInfo[]> => {
  try {
    // تلاش برای دریافت اطلاعات از سرور
    const response = await axios.get(`${API_URL}/users`);
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاربران از سرور:', error);
    // استفاده از داده‌های محلی در صورت خطا
    console.log('استفاده از داده‌های محلی...');
  }
  
  // برگرداندن داده‌های محلی
  return users;
};

export const getQuiz2Users = async (): Promise<Quiz2User[]> => {
  try {
    const response = await axios.get(`${API_URL}/quiz2/users`);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاربران کوییز 2 از سرور:', error);
    return [];
  }
};

// تابع کمکی برای دانلود فایل اکسل
export const downloadExcel = (usersForExcel?: UserInfo[]): void => {
  saveUsersToExcel(true, usersForExcel);
};

// ذخیره اطلاعات کاربران در فایل اکسل
const saveUsersToExcel = async (download = false, usersForExcel?: UserInfo[]): Promise<void> => {
  try {
    // تابع کمکی برای تبدیل فعالیت‌ها به فارسی
    const translateActivities = (activities: any): string => {
      const activitiesMap: Record<string, string> = {
        'beach': 'ساحل و دریا',
        'hiking': 'طبیعت‌گردی و کوه',
        'city': 'گشت‌وگذار شهری',
        'cultural': 'جاذبه‌های تاریخی و فرهنگی'
      };
      if (Array.isArray(activities)) {
        return activities.map(act => activitiesMap[act] || act).join('، ');
      } else if (typeof activities === 'string') {
        if (activities.includes(',')) {
          return activities.split(',').map(act => activitiesMap[act.trim()] || act.trim()).join('، ');
        } else {
          return activitiesMap[activities] || activities;
        }
      }
      return '';
    };
    const translateDuration = (duration: string): string => {
      const durationMap: Record<string, string> = {
        'short': 'کمتر از ۵ روز',
        'medium': '۵ تا ۱۰ روز',
        'long': 'بیشتر از ۱۰ روز'
      };
      return durationMap[duration] || duration;
    };
    const translateSeason = (season: string): string => {
      const seasonMap: Record<string, string> = {
        'spring': 'بهار',
        'summer': 'تابستان',
        'fall': 'پاییز',
        'winter': 'زمستان'
      };
      return seasonMap[season] || season;
    };
    // استفاده از usersForExcel اگر داده شده، وگرنه users پیش‌فرض
    const dataSource = usersForExcel || users;
    const excelData = dataSource.map(user => {
      const activities = user.activities || (user.quizAnswers?.activities);
      const translatedActivities = translateActivities(activities);
      const duration = user.duration || user.quizAnswers?.duration || '';
      const translatedDuration = duration ? translateDuration(duration) : '';
      const season = user.season || user.quizAnswers?.season || '';
      const translatedSeason = season ? translateSeason(season) : '';
      return {
        'نام و نام خانوادگی': user.name || 'بدون نام',
        'شماره موبایل': user.phone,
        'مقصد سفر': user.travel_destination || user.travelDestination || '',
        'امتیاز': user.score || 0,
        'ترجیح سفر': user.location || (user.quizAnswers?.location) || '',
        'فعالیت‌ها': translatedActivities,
        'مدت سفر': translatedDuration,
        'فصل مورد علاقه': translatedSeason,
        'بودجه': user.budget || user.quizAnswers?.budget || '',
        'میزان ماجراجویی': user.adventure || user.quizAnswers?.adventure || '',
        'تاریخ ثبت': user.created_at 
          ? new Date(user.created_at).toLocaleString('fa-IR')
          : new Date(user.timestamp).toLocaleString('fa-IR'),
      };
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('کاربران');

    // تعریف ستون‌ها
    worksheet.columns = [
      { header: 'نام و نام خانوادگی', key: 'name', width: 20 },
      { header: 'شماره موبایل', key: 'phone', width: 15 },
      { header: 'مقصد سفر', key: 'destination', width: 20 },
      { header: 'امتیاز', key: 'score', width: 10 },
      { header: 'ترجیح سفر', key: 'location', width: 15 },
      { header: 'فعالیت‌ها', key: 'activities', width: 30 },
      { header: 'مدت سفر', key: 'duration', width: 15 },
      { header: 'فصل مورد علاقه', key: 'season', width: 15 },
      { header: 'بودجه', key: 'budget', width: 15 },
      { header: 'میزان ماجراجویی', key: 'adventure', width: 15 },
      { header: 'تاریخ ثبت', key: 'date', width: 20 },
    ];

    dataSource.forEach(user => {
      const activities = user.activities || (user.quizAnswers?.activities);
      const translatedActivities = translateActivities(activities);
      const duration = user.duration || user.quizAnswers?.duration || '';
      const translatedDuration = duration ? translateDuration(duration) : '';
      const season = user.season || user.quizAnswers?.season || '';
      const translatedSeason = season ? translateSeason(season) : '';
      
      worksheet.addRow({
        name: user.name || 'بدون نام',
        phone: user.phone,
        destination: user.travel_destination || user.travelDestination || '',
        score: user.score || 0,
        location: user.location || (user.quizAnswers?.location) || '',
        activities: translatedActivities,
        duration: translatedDuration,
        season: translatedSeason,
        budget: user.budget || user.quizAnswers?.budget || '',
        adventure: user.adventure || user.quizAnswers?.adventure || '',
        date: user.created_at 
          ? new Date(user.created_at).toLocaleString('fa-IR')
          : new Date(user.timestamp).toLocaleString('fa-IR'),
      });
    });

    if (download) {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'travel_quiz_users.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('خطا در ذخیره فایل اکسل:', error);
  }
};

export const downloadExcelForQuiz2 = async (usersForExcel: Quiz2User[]): Promise<void> => {
  try {
    const excelData = usersForExcel.map(user => {
      let answers = {};
      try {
        answers = JSON.parse(user.answers);
      } catch (e) {
        // نادیده گرفتن خطا اگر جیسون معتبر نباشد
      }

      return {
        'نام و نام خانوادگی': user.name,
        'شماره موبایل': user.phone,
        'نتیجه': user.result,
        'پاسخ‌ها': JSON.stringify(answers, null, 2),
        'تاریخ ثبت': new Date(user.created_at).toLocaleString('fa-IR'),
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('کاربران کوییز ۲');

    // تعریف ستون‌ها
    worksheet.columns = [
      { header: 'نام و نام خانوادگی', key: 'name', width: 20 },
      { header: 'شماره موبایل', key: 'phone', width: 15 },
      { header: 'نتیجه', key: 'result', width: 20 },
      { header: 'پاسخ‌ها', key: 'answers', width: 50 },
      { header: 'تاریخ ثبت', key: 'date', width: 20 },
    ];

    usersForExcel.forEach(user => {
      let answers = {};
      try {
        answers = JSON.parse(user.answers);
      } catch (e) {
        // نادیده گرفتن خطا اگر جیسون معتبر نباشد
      }

      worksheet.addRow({
        name: user.name,
        phone: user.phone,
        result: user.result,
        answers: JSON.stringify(answers, null, 2),
        date: new Date(user.created_at).toLocaleString('fa-IR'),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel_quiz_2_users.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('خطا در ذخیره فایل اکسل کوییز ۲:', error);
  }
};


// ارسال پیامک با سرویس کاوه نگار
export const sendSMS = async (phone: string, name: string): Promise<boolean> => {
  console.log('در حال ارسال پیامک به:', phone, 'با نام:', name);
  
  if (!phone || phone.trim() === '') {
    console.error('شماره موبایل وارد نشده است');
    return false;
  }
  
  const apiKey = import.meta.env.VITE_KAVENEGAR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ خطا: متغیر محیطی VITE_KAVENEGAR_API_KEY تنظیم نشده است');
    return false;
  }
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
  
  const apiKey = import.meta.env.VITE_KAVENEGAR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ خطا: متغیر محیطی VITE_KAVENEGAR_API_KEY تنظیم نشده است');
    return false;
  }
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

// ارسال پیامک با الگوی smscontact
export const sendContactSMS = async (phone: string, name: string): Promise<boolean> => {
  console.log('در حال ارسال پیامک مشاوره به:', phone, 'با نام:', name);
  
  if (!phone || phone.trim() === '') {
    console.error('شماره موبایل وارد نشده است');
    return false;
  }
  
  const apiKey = import.meta.env.VITE_KAVENEGAR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ خطا: متغیر محیطی VITE_KAVENEGAR_API_KEY تنظیم نشده است');
    return false;
  }
  const template = 'smscontact';
  
  // ارسال با استفاده از الگوی smscontact
  const templateUrl = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${encodeURIComponent(phone)}&template=${encodeURIComponent(template)}&token=${encodeURIComponent(name || 'کاربر گرامی')}`;
  console.log('ارسال پیامک با الگوی مشاوره:', templateUrl);
  
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
    console.error('خطا در ارسال پیامک با الگوی مشاوره:', error);
    return false;
  }
}; 