/**
 * ابزارهای کمکی برای ارسال پیامک
 */

/**
 * ارسال درخواست با روش JSONP برای دور زدن محدودیت‌های CORS
 * 
 * @param url آدرس API
 * @param callbackName نام تابع callback
 * @param timeout زمان انتظار (میلی‌ثانیه)
 * @returns Promise
 */
export const jsonp = (url: string, callbackName: string = 'jsonpCallback', timeout: number = 10000): Promise<any> => {
  return new Promise((resolve, reject) => {
    // ایجاد یک نام تابع منحصر به فرد
    const uniqueCallbackName = `${callbackName}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // ایجاد script tag
    const script = document.createElement('script');
    
    // تایمر برای رد درخواست در صورت عدم پاسخ
    let timeoutId: number | null = null;
    
    // تابع پاکسازی
    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // حذف script از DOM
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      // حذف تابع callback از window
      delete (window as any)[uniqueCallbackName];
    };
    
    // تنظیم تایمر
    timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, timeout);
    
    // تعریف تابع callback
    (window as any)[uniqueCallbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };
    
    // اضافه کردن پارامتر callback به URL
    const sep = url.indexOf('?') !== -1 ? '&' : '?';
    const jsonpUrl = `${url}${sep}callback=${uniqueCallbackName}`;
    
    // تنظیم مدیریت خطا
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed'));
    };
    
    // تنظیم src و اضافه کردن script به DOM
    script.src = jsonpUrl;
    document.head.appendChild(script);
  });
};

/**
 * ارسال پیامک متنی با استفاده از روش JSONP
 * 
 * @param phone شماره موبایل
 * @param message متن پیام
 * @param apiKey کلید API کاوه نگار
 * @param sender شماره فرستنده
 * @returns Promise
 */
export const sendSMSWithJSONP = async (phone: string, message: string, apiKey: string, sender: string = '10008663'): Promise<boolean> => {
  try {
    console.log('ارسال پیامک با روش JSONP به:', phone);
    
    // ساخت URL
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}&sender=${encodeURIComponent(sender)}`;
    
    console.log('URL JSONP:', url);
    
    try {
      // تلاش با روش JSONP
      const result = await jsonp(url);
      console.log('نتیجه JSONP:', result);
      return true;
    } catch (jsonpError) {
      console.error('خطا در JSONP:', jsonpError);
      
      // روش پشتیبان با عنصر تصویر
      const img = new Image();
      img.onload = () => console.log('درخواست تصویری JSONP بازیابی موفقیت‌آمیز');
      img.onerror = () => console.log('خطا در درخواست تصویری JSONP (طبیعی است)');
      img.src = url;
      
      return true;
    }
  } catch (error) {
    console.error('خطا در ارسال پیامک با JSONP:', error);
    return false;
  }
};

/**
 * ارسال پیامک با فرم در یک iframe
 * 
 * @param phone شماره موبایل
 * @param message متن پیام
 * @param apiKey کلید API کاوه نگار
 * @param sender شماره فرستنده
 * @returns Promise
 */
export const sendSMSWithIframe = async (phone: string, message: string, apiKey: string, sender: string = '10008663'): Promise<boolean> => {
  try {
    console.log('ارسال پیامک با iframe به:', phone);
    
    return new Promise((resolve) => {
      // ایجاد iframe مخفی
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // بررسی contentDocument
      if (!iframe.contentDocument) {
        console.error('خطا در دسترسی به contentDocument iframe');
        document.body.removeChild(iframe);
        resolve(false);
        return;
      }
      
      // ایجاد فرم
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
      form.target = '_blank';
      
      // افزودن فیلدها
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };
      
      addField('receptor', phone);
      addField('message', message);
      addField('sender', sender);
      
      // افزودن فرم به iframe
      iframe.contentDocument.body.appendChild(form);
      
      // ارسال فرم
      form.submit();
      
      // حذف iframe بعد از مدتی
      setTimeout(() => {
        document.body.removeChild(iframe);
        resolve(true);
      }, 3000);
    });
  } catch (error) {
    console.error('خطا در ارسال پیامک با iframe:', error);
    return false;
  }
}; 