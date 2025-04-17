import { useState } from 'react';
import { ChevronDown, Send, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactUs = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
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
            <a href="tel:02191313485" className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-peyk-blue">
              <Phone className="h-5 w-5 ml-2 text-peyk-blue" />
              <span>۰۲۱-۹۱۳۱۳۴۸۵</span>
            </a>
            <a href="mailto:info@peykkhorshid.ir" className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-peyk-blue">
              <Mail className="h-5 w-5 ml-2 text-peyk-blue" />
              <span>info@peykkhorshid.ir</span>
            </a>
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
              <h3 className="text-xl font-bold text-white mb-1">اگر سوالت اینجا نیست از ما بپرس</h3>
              <p className="text-blue-100 text-sm mb-4">
                کارشناسان پیک خورشید آماده‌اند تا به تمام سوالات شما پاسخ دهند.
              </p>
              <div className="relative">
                <Input 
                  placeholder="نام و نام خانوادگی" 
                  className="rtl pr-5 focus:border-peyk-blue bg-white/90 placeholder:text-gray-500"
                />
              </div>
              <div className="relative">
                <Input 
                  placeholder="شماره موبایل" 
                  className="rtl pr-5 focus:border-peyk-blue bg-white/90 placeholder:text-gray-500" 
                  dir="ltr"
                />
              </div>
              <div className="relative flex-grow">
                <Textarea 
                  placeholder="پیام شما" 
                  className="rtl resize-none min-h-[150px] h-full focus:border-peyk-blue bg-white/90 placeholder:text-gray-500" 
                  rows={5}
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-peyk-orange to-peyk-orange-dark hover:from-peyk-orange-dark hover:to-peyk-orange text-white transition-all duration-300 shadow-md hover:shadow-lg">
                <Send className="h-5 w-5 ml-2" />
                ارسال پیام
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs; 