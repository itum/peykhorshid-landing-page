import { Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube, CreditCard, ShieldCheck, Heart, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
      <div className="container mx-auto py-12 px-4 md:px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">پیک خورشید اهواز</h3>
            <p className="leading-relaxed text-justify">شرکت خدمات مسافرت هوایی جهانگردی و زیارتی پیک خورشید اهواز با مجوز رسمی از سازمان هواپیمایی کشوری (بندالف) و مجوز رسمی از سازمان میراث فرهنگی و گردشگری (مجوز ب) و سازمان حج و زیارت (مجوز ب) و نمایندگی فروش رجا و با عضویت در انجمن بین المللی حمل و نقل هوایی iata از سال 1380 فعالیت خود را آغاز نموده است در این سال ها همیشه رضایت کامل مسافران را مهمترین هدف خود قرار داده است</p>
            <div className="flex space-x-3 space-x-reverse">
              <a href="#" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md hover:bg-peyk-blue hover:text-white transition-all duration-300" aria-label="اینستاگرام">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md hover:bg-peyk-blue hover:text-white transition-all duration-300" aria-label="توییتر">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md hover:bg-peyk-blue hover:text-white transition-all duration-300" aria-label="لینکدین">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md hover:bg-peyk-blue hover:text-white transition-all duration-300" aria-label="فیسبوک">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md hover:bg-peyk-blue hover:text-white transition-all duration-300" aria-label="یوتیوب">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">خدمات ما</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  خرید بلیط هواپیما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  تور داخلی و خارجی
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  رزرو هتل
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  خدمات ویزا
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  تورهای زیارتی
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">لینک‌های مفید</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  قوانین و مقررات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  حریم خصوصی
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  تماس با ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  استخدام
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-peyk-blue group-hover:text-white transition-all duration-300 ml-3 mt-1">
                  <MapPin className="h-5 w-5 text-peyk-blue group-hover:text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sm text-gray-800">دفتر تهران:</span>
                  <a href="https://maps.google.com/?q=سعادت+آباد+بلوار+دریا+تقاطع+فرحزادی+ساختمان+صدف+واحد+یک" target="_blank" rel="noopener noreferrer" className="group-hover:text-peyk-blue transition-colors duration-300 text-sm hover:underline">سعادت آباد بلوار دریا تقاطع فرحزادی ساختمان صدف واحد یک</a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-peyk-blue group-hover:text-white transition-all duration-300 ml-3 mt-1">
                  <MapPin className="h-5 w-5 text-peyk-blue group-hover:text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sm text-gray-800">دفتر اهواز:</span>
                  <a href="https://maps.google.com/?q=اهواز+سی+متری+نبش+چهارراه+زند+پلاک+117" target="_blank" rel="noopener noreferrer" className="group-hover:text-peyk-blue transition-colors duration-300 text-sm hover:underline">سی متری نبش چهارراه زند پلاک 117</a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-peyk-blue group-hover:text-white transition-all duration-300 ml-3 mt-1">
                  <Phone className="h-5 w-5 text-peyk-blue group-hover:text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sm text-gray-800">تلفن پشتیبانی 24 ساعته:</span>
                  <a href="tel:02191313485" className="group-hover:text-peyk-blue transition-colors duration-300 text-sm hover:underline">۰۲۱-۹۱۳۱۳۴۸۵</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="mb-2 md:mb-0">تمامی حقوق محفوظ است © ۱۴۰۴ <a href="https://peykkhorshid.ir/" target="_blank" rel="noopener noreferrer" className="text-peyk-blue hover:text-peyk-blue-dark transition-colors">پیک خورشید اهواز</a></p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/enamad.jpg" alt="نماد اعتماد الکترونیکی" className="h-14 w-auto" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/samadehi.png" alt="نشان ساماندهی" className="h-14 w-auto" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/images/havapeymaei-keshvari.png" alt="هواپیمایی کشوری" className="h-14 w-auto" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/images/hoghoghe-mosafer.png" alt="حقوق مسافر" className="h-14 w-auto" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/images/nerkhebilit.png" alt="نرخ بلیط" className="h-14 w-auto" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center items-center">
            <a 
              href="https://farazec.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative py-3 px-6 bg-gradient-to-r from-white via-blue-50 to-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-2 justify-center">
                <span className="inline-block w-3 h-3 bg-peyk-blue rounded-full group-hover:animate-ping"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-peyk-blue via-blue-500 to-peyk-blue text-sm font-semibold group-hover:scale-105 transition-all duration-300">طراحی و پیاده‌سازی شده توسط تجارت الکترونیک فراز</span>
                <span className="inline-block w-3 h-3 bg-peyk-blue rounded-full group-hover:animate-ping"></span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-700"></div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
