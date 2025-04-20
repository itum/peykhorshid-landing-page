import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// نوع داده آمار روزانه
export interface DailyStats {
  click_date: string;
  total_clicks: number;
}

// نوع داده آمار کلی بر اساس نوع
export interface TypeStats {
  item_id: string;
  item_name: string;
  total_clicks: number;
}

// نوع داده آمار کلی همه انواع
export interface AllStats {
  item_type: string;
  total_clicks: number;
}

// نوع داده پربازدیدترین آیتم‌ها
export interface TopItem {
  item_type: string;
  item_id: string;
  item_name: string;
  total_clicks: number;
}

// نوع داده برای کلیک‌های ذخیره شده محلی
interface StoredClick {
  itemType: string;
  itemId: string;
  itemName: string;
  timestamp: number;
  sent: boolean;
}

// دریافت کلیک‌های ذخیره شده محلی
const getStoredClicks = (): StoredClick[] => {
  const stored = localStorage.getItem('peyk_click_stats');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('خطا در خواندن کلیک‌های محلی:', e);
      return [];
    }
  }
  return [];
};

// ذخیره کلیک‌ها در localStorage
const storeClicks = (clicks: StoredClick[]) => {
  localStorage.setItem('peyk_click_stats', JSON.stringify(clicks));
};

// تلاش برای ارسال کلیک‌های ذخیره شده به سرور
const syncStoredClicks = async () => {
  const clicks = getStoredClicks();
  
  if (clicks.length === 0) return;
  
  // فقط کلیک‌های ارسال نشده را فیلتر می‌کنیم
  const unsent = clicks.filter(click => !click.sent);
  
  if (unsent.length === 0) return;
  
  console.log(`تلاش برای ارسال ${unsent.length} کلیک ذخیره شده به سرور`);
  
  // ارسال هر کلیک به سرور
  for (const click of unsent) {
    try {
      await axios.post(`${API_URL}/stats/click`, {
        itemType: click.itemType,
        itemId: click.itemId,
        itemName: click.itemName
      });
      
      // علامت‌گذاری کلیک به عنوان ارسال شده
      click.sent = true;
      console.log(`کلیک ${click.itemType} - ${click.itemId} با موفقیت به سرور ارسال شد`);
    } catch (error) {
      console.error(`خطا در ارسال کلیک ${click.itemType} - ${click.itemId} به سرور:`, error);
    }
  }
  
  // ذخیره وضعیت جدید
  storeClicks(clicks);
  
  // حذف کلیک‌های قدیمی که ارسال شده‌اند (بیش از 7 روز)
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const filtered = clicks.filter(click => !click.sent || click.timestamp > oneWeekAgo);
  
  if (filtered.length !== clicks.length) {
    console.log(`${clicks.length - filtered.length} کلیک قدیمی ارسال شده حذف شدند`);
    storeClicks(filtered);
  }
};

// ثبت کلیک جدید
export const registerClick = async (itemType: string, itemId: string, itemName: string = '') => {
  try {
    // ابتدا کلیک را محلی ذخیره می‌کنیم
    const clicks = getStoredClicks();
    const newClick: StoredClick = {
      itemType,
      itemId,
      itemName,
      timestamp: Date.now(),
      sent: false
    };
    
    clicks.push(newClick);
    storeClicks(clicks);
    console.log(`کلیک ${itemType} - ${itemId} محلی ذخیره شد`);
    
    // سپس تلاش می‌کنیم به سرور ارسال کنیم
    try {
      const response = await axios.post(`${API_URL}/stats/click`, {
        itemType,
        itemId,
        itemName
      });
      
      // اگر ارسال موفق بود، علامت‌گذاری می‌کنیم
      const updatedClicks = getStoredClicks();
      const lastIndex = updatedClicks.length - 1;
      if (lastIndex >= 0) {
        updatedClicks[lastIndex].sent = true;
        storeClicks(updatedClicks);
      }
      
      console.log(`کلیک ${itemType} - ${itemId} با موفقیت به سرور ارسال شد`);
      return response.data;
    } catch (error) {
      console.error(`خطا در ارسال کلیک ${itemType} - ${itemId} به سرور:`, error);
      
      // همچنین تلاش می‌کنیم کلیک‌های قبلی را ارسال کنیم
      setTimeout(() => syncStoredClicks(), 5000);
      
      // رد کردن خطا تا ClickTracker بتواند عملکرد خود را ادامه دهد
      return { success: true, local: true };
    }
  } catch (error) {
    console.error('خطا در ثبت کلیک محلی:', error);
    throw error;
  }
};

// دریافت آمار کلیک‌های محلی
export const getLocalStats = (itemType?: string): TopItem[] => {
  const clicks = getStoredClicks();
  const stats: Record<string, TopItem> = {};
  
  clicks.forEach(click => {
    if (itemType && click.itemType !== itemType) return;
    
    const key = `${click.itemType}|${click.itemId}`;
    
    if (!stats[key]) {
      stats[key] = {
        item_type: click.itemType,
        item_id: click.itemId,
        item_name: click.itemName,
        total_clicks: 0
      };
    }
    
    stats[key].total_clicks += 1;
  });
  
  return Object.values(stats).sort((a, b) => b.total_clicks - a.total_clicks);
};

// دریافت آمار روزانه به صورت محلی
export const getLocalDailyStats = (itemType: string): DailyStats[] => {
  const clicks = getStoredClicks();
  const stats: Record<string, DailyStats> = {};
  
  clicks.forEach(click => {
    if (click.itemType !== itemType) return;
    
    const date = new Date(click.timestamp);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!stats[dateStr]) {
      stats[dateStr] = {
        click_date: dateStr,
        total_clicks: 0
      };
    }
    
    stats[dateStr].total_clicks += 1;
  });
  
  return Object.values(stats).sort((a, b) => b.click_date.localeCompare(a.click_date));
};

// دریافت آمار روزانه بر اساس نوع آیتم
export const getDailyStats = async (itemType: string, limit: number = 30): Promise<DailyStats[]> => {
  try {
    const response = await axios.get(`${API_URL}/stats/daily/${itemType}?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('خطا در دریافت آمار روزانه از سرور:', error);
    // بازگشت آمار محلی در صورت خطا
    return getLocalDailyStats(itemType);
  }
};

// دریافت آمار کلی بر اساس نوع آیتم
export const getTotalStatsByType = async (itemType: string): Promise<TypeStats[]> => {
  try {
    const response = await axios.get(`${API_URL}/stats/total/${itemType}`);
    return response.data.data;
  } catch (error) {
    console.error('خطا در دریافت آمار کلی بر اساس نوع از سرور:', error);
    // بازگشت آمار محلی در صورت خطا
    return getLocalStats(itemType).map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      total_clicks: item.total_clicks
    }));
  }
};

// دریافت آمار کلی همه انواع
export const getAllStats = async (): Promise<AllStats[]> => {
  try {
    const response = await axios.get(`${API_URL}/stats/all`);
    return response.data.data;
  } catch (error) {
    console.error('خطا در دریافت کل آمارها از سرور:', error);
    
    // محاسبه آمار محلی برای بازگشت
    const clicks = getStoredClicks();
    const stats: Record<string, AllStats> = {};
    
    clicks.forEach(click => {
      if (!stats[click.itemType]) {
        stats[click.itemType] = {
          item_type: click.itemType,
          total_clicks: 0
        };
      }
      
      stats[click.itemType].total_clicks += 1;
    });
    
    return Object.values(stats).sort((a, b) => b.total_clicks - a.total_clicks);
  }
};

// دریافت پربازدیدترین آیتم‌ها
export const getTopItems = async (limit: number = 100): Promise<TopItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/stats/top?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('خطا در دریافت پربازدیدترین آیتم‌ها از سرور:', error);
    // بازگشت آمار محلی در صورت خطا
    return getLocalStats().slice(0, limit);
  }
};

// شروع همگام‌سازی در زمان بارگذاری
setTimeout(() => {
  syncStoredClicks();
}, 10000);

// همگام‌سازی کلیک‌ها هر 5 دقیقه
setInterval(() => {
  syncStoredClicks();
}, 5 * 60 * 1000); 