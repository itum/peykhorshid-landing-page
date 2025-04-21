import { useState } from 'react';
import { ChevronDown, Send, Phone, Mail, CheckCircle, Loader2, AlertTriangle, User, Smartphone, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendContactMessage } from '@/lib/services/contactService';
import { toast } from 'sonner';
import ClickTracker from './ClickTracker';

// تابع تبدیل اعداد فارسی و عربی به انگلیسی
const convertToEnglishNumber = (str: string): string => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  if (!str) return str;
  
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianNumbers[i], i.toString())
                   .replace(arabicNumbers[i], i.toString());
  }
  
  return result;
};

// تابع اعتبارسنجی شماره موبایل ایرانی
const isValidIranianMobile = (phone: string): boolean => {
  const convertedPhone = convertToEnglishNumber(phone);
  // الگوی شماره موبایل ایرانی (شروع با 09 و مجموعاً 11 رقم)
  const mobileRegex = /^09[0-9]{9}$/;
  
  return mobileRegex.test(convertedPhone);
};

const ContactUs = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    destination: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    message: '',
    destination: ''
  });

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // پاک کردن پیام خطا در صورت تغییر مقدار فیلد
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // بررسی و تنظیم خطاها
    let hasError = false;
    const newErrors = { ...formErrors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'نام شما برای برنامه‌ریزی سفر رویایی‌تان ضروری است! 🧳';
      hasError = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'بدون شماره تماس چطور می‌توانیم شما را از تخفیف‌های ویژه باخبر کنیم؟ 📱';
      hasError = true;
    } else if (!isValidIranianMobile(formData.phone)) {
      newErrors.phone = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد ☎️';
      hasError = true;
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'مقصد بعدی سفر شما کجاست؟ بگذارید کمکتان کنیم! 🗺️';
      hasError = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'کمی درباره سفر رویایی‌تان به ما بگویید، منتظر شنیدن هستیم! ✈️';
      hasError = true;
    }
    
    setFormErrors(newErrors);
    
    if (hasError) {
      toast.error('لطفاً همه فیلدها را به درستی تکمیل کنید', {
        icon: <AlertTriangle className="text-red-500 h-5 w-5" />
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // تبدیل شماره موبایل به انگلیسی قبل از ارسال به سرور
      const dataToSend = {
        ...formData,
        phone: convertToEnglishNumber(formData.phone)
      };
      await sendContactMessage(dataToSend);
      setIsSuccess(true);
      toast.success('درخواست مشاوره شما با موفقیت ثبت شد');
      // پاک کردن فرم
      setFormData({
        name: '',
        phone: '',
        message: '',
        destination: ''
      });
      setFormErrors({
        name: '',
        phone: '',
        message: '',
        destination: ''
      });
    } catch (error) {
      console.error('خطا در ارسال درخواست مشاوره:', error);
      toast.error('خطا در ارسال درخواست مشاوره. لطفاً دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: 'چگونه می‌توانم تور مورد نظرم را از پیک خورشید اهواز رزرو کنم؟',
      answer: 'برای رزرو تور مورد نظر می‌توانید از طریق وبسایت اقدام کنید یا با شماره‌های ما تماس بگیرید تا کارشناسان ما شما را راهنمایی کنند.'
    },
    {
      question: 'برای رزرو تور چه مدارکی مورد نیاز است؟',
      answer: 'برای رزرو تور به مدارک شناسایی معتبر مانند کارت ملی و گذرنامه (برای تورهای خارجی) نیاز خواهید داشت. برای اطلاعات دقیق‌تر با کارشناسان ما تماس بگیرید.'
    },
    {
      question: 'آیا امکان انصراف از تور و استرداد وجه وجود دارد؟',
      answer: 'بله، شرایط انصراف و استرداد وجه بسته به نوع تور و زمان انصراف متفاوت است. جزئیات در قرارداد هر تور ذکر شده است.'
    },
    {
      question: 'تفاوت تورهای داخلی و خارجی خاص در چیست؟',
      answer: 'تورهای خاص شامل مقاصد ویژه با خدمات اختصاصی و برنامه‌های متنوع‌تر هستند. این تورها معمولاً دارای امکانات لوکس‌تر و تجربه‌های منحصر به فرد هستند.'
    },
    {
      question: 'آیا امکان سفارشی‌سازی برنامه‌های تور وجود دارد؟',
      answer: 'بله، در پیک خورشید اهواز امکان طراحی تورهای اختصاصی مطابق با سلیقه و نیاز شما وجود دارد. کافیست با کارشناسان ما تماس بگیرید.'
    }
  ];

  return (
    <section id="contact-us" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تماس با ما</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            کارشناسان پیک خورشید آماده‌اند تا به تمام سوالات شما پاسخ دهند. فقط کافیست پیام خود را برای ما ارسال کنید و در کوتاه‌ترین زمان ممکن، راهنمایی‌های لازم را دریافت کنید.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <ClickTracker itemType="support" itemId="06135518880" itemName="تلفن پشتیبانی 24 ساعته">
              <a href="tel:06135518880" className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-peyk-blue">
                <Phone className="h-5 w-5 ml-2 text-peyk-blue" />
                <span>۰۶۱-۳۵۵۱۸۸۸۰</span>
              </a>
            </ClickTracker>
            <ClickTracker itemType="contact" itemId="email" itemName="ایمیل پشتیبانی">
              <a href="mailto:info@peykkhorshid.ir" className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-peyk-blue">
                <Mail className="h-5 w-5 ml-2 text-peyk-blue" />
                <span>info@peykkhorshid.ir</span>
              </a>
            </ClickTracker>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">پشتیبانی تور</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <ClickTracker itemType="support" itemId="09902483117" itemName="پشتیبانی تور 1">
                <a href="tel:09902483117" className="flex items-center bg-gradient-to-r from-peyk-blue to-blue-500 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-white transform hover:scale-105">
                  <Phone className="h-5 w-5 ml-2 animate-pulse" />
                  <span>۰۹۹۰۲۴۸۳۱۱۷</span>
                </a>
              </ClickTracker>
              <ClickTracker itemType="support" itemId="09018880438" itemName="پشتیبانی تور 2">
                <a href="tel:09018880438" className="flex items-center bg-gradient-to-r from-blue-500 to-peyk-blue-dark px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-white transform hover:scale-105">
                  <Phone className="h-5 w-5 ml-2 animate-pulse" />
                  <span>۰۹۰۱۸۸۸۰۴۳۸</span>
                </a>
              </ClickTracker>
              <ClickTracker itemType="support" itemId="09017770438" itemName="پشتیبانی تور 3">
                <a href="tel:09017770438" className="flex items-center bg-gradient-to-r from-peyk-blue-dark to-peyk-blue px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-white transform hover:scale-105">
                  <Phone className="h-5 w-5 ml-2 animate-pulse" />
                  <span>۰۹۰۱۷۷۷۰۴۳۸</span>
                </a>
              </ClickTracker>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* سوالات پرتکرار - سمت راست */}
          <div className="h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">سوالات پر تکرار</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    className="w-full p-4 text-right flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                        expandedFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFaq === index ? 'max-h-40 pb-4 px-4' : 'max-h-0'
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* فرم تماس با ما - سمت چپ */}
          <div className="bg-blue-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
            <div className="p-6 space-y-4 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-1">درخواست مشاوره رایگان</h3>
              <p className="text-blue-100 text-sm mb-4">
                کارشناسان پیک خورشید آماده ارائه مشاوره تخصصی برای برنامه‌ریزی سفر شما هستند. فرم زیر را تکمیل کنید تا در اسرع وقت با شما تماس بگیریم.
              </p>
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center flex-grow text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                  <h4 className="text-white text-xl font-bold mb-2">درخواست مشاوره شما با موفقیت ثبت شد</h4>
                  <p className="text-blue-100">
                    کارشناسان ما در اولین فرصت با شما تماس خواهند گرفت.
                  </p>
                  <Button 
                    className="mt-6 bg-white text-blue-900 hover:bg-gray-100"
                    onClick={() => setIsSuccess(false)}
                  >
                    ثبت درخواست جدید
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
                  <div className="relative">
                    <div className="flex items-center relative">
                      <User className="absolute right-3 text-gray-500 h-4 w-4" />
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="نام و نام خانوادگی" 
                        className={`rtl pr-10 focus:border-peyk-blue bg-white/90 placeholder:text-gray-500 ${formErrors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-peyk-orange text-xs mt-1 mr-1 flex items-center bg-white/90 px-2 py-1 rounded-md">
                        <AlertTriangle className="h-3 w-3 ml-1 animate-pulse" /> {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <div className="flex items-center relative">
                      <Smartphone className="absolute right-3 text-gray-500 h-4 w-4" />
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="شماره موبایل (با ۰۹ شروع شود)" 
                        className={`rtl pr-10 focus:border-peyk-blue bg-white/90 placeholder:text-gray-500 ${formErrors.phone ? 'border-red-400 focus:border-red-400' : ''}`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-peyk-orange text-xs mt-1 mr-1 flex items-center bg-white/90 px-2 py-1 rounded-md">
                        <AlertTriangle className="h-3 w-3 ml-1 animate-pulse" /> {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <div className="flex items-center relative">
                      <MapPin className="absolute right-3 text-gray-500 h-4 w-4" />
                      <Input 
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="مقصد مورد نظر" 
                        className={`rtl pr-10 focus:border-peyk-blue bg-white/90 placeholder:text-gray-500 ${formErrors.destination ? 'border-red-400 focus:border-red-400' : ''}`}
                      />
                    </div>
                    {formErrors.destination && (
                      <p className="text-peyk-orange text-xs mt-1 mr-1 flex items-center bg-white/90 px-2 py-1 rounded-md">
                        <AlertTriangle className="h-3 w-3 ml-1 animate-pulse" /> {formErrors.destination}
                      </p>
                    )}
                  </div>
                  <div className="relative flex-grow">
                    <div className="flex items-start relative">
                      <MessageSquare className="absolute right-3 top-3 text-gray-500 h-4 w-4" />
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="توضیحات و سوالات خود را بنویسید" 
                        className={`rtl pr-10 resize-none min-h-[150px] h-full focus:border-peyk-blue bg-white/90 placeholder:text-gray-500 ${formErrors.message ? 'border-red-400 focus:border-red-400' : ''}`}
                        rows={5}
                      />
                    </div>
                    {formErrors.message && (
                      <p className="text-peyk-orange text-xs mt-1 mr-1 flex items-center bg-white/90 px-2 py-1 rounded-md">
                        <AlertTriangle className="h-3 w-3 ml-1 animate-pulse" /> {formErrors.message}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-peyk-orange to-peyk-orange-dark hover:from-peyk-orange-dark hover:to-peyk-orange text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        درخواست مشاوره رایگان
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs; 