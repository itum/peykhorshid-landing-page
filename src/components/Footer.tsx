import { Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube, CreditCard, ShieldCheck, Heart, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
      <div className="container mx-auto py-12 px-4 md:px-6">
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 py-4 border-b border-gray-300">
          <div className="flex flex-col items-center text-center hover:text-peyk-blue transition-colors duration-300">
            <div className="bg-white p-3 rounded-full shadow-md mb-3">
              <ShieldCheck className="h-7 w-7 text-peyk-blue" />
            </div>
            <h4 className="font-bold">پرداخت امن</h4>
            <p className="text-sm mt-1">امنیت بالا در تمام پرداخت‌ها</p>
          </div>
          <div className="flex flex-col items-center text-center hover:text-peyk-blue transition-colors duration-300">
            <div className="bg-white p-3 rounded-full shadow-md mb-3">
              <CreditCard className="h-7 w-7 text-peyk-blue" />
            </div>
            <h4 className="font-bold">اقساط آسان</h4>
            <p className="text-sm mt-1">پرداخت اقساطی بدون ضامن</p>
          </div>
          <div className="flex flex-col items-center text-center hover:text-peyk-blue transition-colors duration-300">
            <div className="bg-white p-3 rounded-full shadow-md mb-3">
              <Clock className="h-7 w-7 text-peyk-blue" />
            </div>
            <h4 className="font-bold">پشتیبانی ۲۴/۷</h4>
            <p className="text-sm mt-1">پاسخگویی در تمام ساعات هفته</p>
          </div>
          <div className="flex flex-col items-center text-center hover:text-peyk-blue transition-colors duration-300">
            <div className="bg-white p-3 rounded-full shadow-md mb-3">
              <Heart className="h-7 w-7 text-peyk-blue" />
            </div>
            <h4 className="font-bold">تضمین رضایت</h4>
            <p className="text-sm mt-1">اطمینان از خرید با کیفیت</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">پیک خورشید اهواز</h3>
            <p className="leading-relaxed">سامانه خرید اقساطی آنلاین بدون ضامن و چک، با سفته الکترونیکی. همراه شما در مسیر خرید آسان و مطمئن.</p>
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
                  وام خرید کالا
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  فروشگاه‌های طرف قرارداد
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  محاسبه اقساط
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  سوالات متداول
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-peyk-blue transition-colors duration-300 flex items-center">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  راهنمای خرید
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
                  <span className="group-hover:text-peyk-blue transition-colors duration-300 text-sm">سعادت آباد بلوار دریا تقاطع فرحزادی ساختمان صدف واحد یک</span>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-peyk-blue group-hover:text-white transition-all duration-300 ml-3 mt-1">
                  <MapPin className="h-5 w-5 text-peyk-blue group-hover:text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sm text-gray-800">دفتر اهواز:</span>
                  <span className="group-hover:text-peyk-blue transition-colors duration-300 text-sm">سی متری نبش چهارراه زند پلاک 117</span>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-peyk-blue group-hover:text-white transition-all duration-300 ml-3 mt-1">
                  <Phone className="h-5 w-5 text-peyk-blue group-hover:text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sm text-gray-800">تلفن پشتیبانی 24 ساعته:</span>
                  <span className="group-hover:text-peyk-blue transition-colors duration-300 text-sm">۰۲۱-۹۱۳۱۳۴۸۵</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative group">
              <p className="mb-6 md:mb-0">تمامی حقوق محفوظ است © ۱۴۰۳ پیک خورشید اهواز</p>
              <div className="absolute bottom-0 md:-bottom-6 right-0 left-0 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 overflow-hidden">
                <a 
                  href="https://farazec.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-peyk-blue hover:text-peyk-blue-dark inline-flex items-center gap-1 justify-center"
                >
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full"></span>
                  <span>طراحی و پیاده‌سازی شده توسط تجارت الکترونیک فراز</span>
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/enamad.png" alt="نماد اعتماد الکترونیکی" className="h-14 w-auto" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img src="/samandehi.png" alt="نشان ساماندهی" className="h-14 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
