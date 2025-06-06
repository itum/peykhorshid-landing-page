import { Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube, CreditCard, ShieldCheck, Heart, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClickTracker from "./ClickTracker";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
      <div className="container mx-auto py-12 px-4 md:px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">پیک خورشید اهواز</h3>
            <p className="leading-relaxed">سامانه خرید اقساطی آنلاین و چک صیادی، با سفته الکترونیکی. همراه شما در مسیر خرید آسان و مطمئن.</p>
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
                <a href="https://peykkhorshid.ir/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  خرید بلیط هواپیما
                </a>
              </li>
              <li>
                <ClickTracker itemType="service" itemId="tours" itemName="تور داخلی و خارجی">
                  <a href="https://peykkhorshid.ir/tours/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                    <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                    تور داخلی و خارجی
                  </a>
                </ClickTracker>
              </li>
              <li>
                <ClickTracker itemType="service" itemId="religious-tours" itemName="تورهای زیارتی">
                  <a href="http://peykkhorshid.ir/tour/%D8%AA%D9%88%D8%B1-%D9%85%D8%B4%D9%87%D8%AF-%D9%88%DB%8C%DA%98%D9%87-%D9%85%DB%8C%D9%84%D8%A7%D8%AF-%D8%A7%D9%85%D8%A7%D9%85-%D8%B1%D8%B6%D8%A7-%D8%B9/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                    <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                    تورهای زیارتی
                  </a>
                </ClickTracker>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-peyk-blue pr-3">لینک‌های مفید</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://peykkhorshid.ir/aboutus/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  درباره ما
                </a>
              </li>
              <li>
                <a href="https://peykkhorshid.ir/%d8%AE%d8%b1%db%8c%d8%af-%d9%82%d8%b3%d8%b7%db%8c-%d8%a2%d9%86%d9%84%d8%a7%db%8c%d9%86-%d9%be%db%8c%da%a9-%d8%ae%d9%88%d8%b1%d8%b4%db%8c%d8%af/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  شرایط اقساطی
                </a>
              </li>
              <li>
                <a href="https://club.peykkhorshid.ir/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  باشگاه مشتریان
                </a>
              </li>
              <li>
                <a href="https://peykkhorshid.ir/contactus/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  تماس با ما
                </a>
              </li>
              <li>
                <a href="https://peykkhorshid.ir/mag/" className="hover:text-peyk-blue transition-colors duration-300 flex items-center" target="_blank" rel="noopener noreferrer">
                  <span className="inline-block w-2 h-2 bg-peyk-blue rounded-full ml-2"></span>
                  مجله
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
                  <a href="tel:06135518880" className="group-hover:text-peyk-blue transition-colors duration-300 text-sm hover:underline">۰۶۱-۳۵۵۱۸۸۸۰</a>
                </div>
              </li>
              <li className="mt-4">
                <span className="block font-bold text-sm text-gray-800 mb-2 border-r-2 border-peyk-blue pr-2">پشتیبانی تور:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <ClickTracker itemType="support" itemId="09902483117" itemName="پشتیبانی تور 1">
                    <a href="tel:09902483117" className="bg-gradient-to-r from-peyk-blue to-blue-500 text-white text-xs px-3 py-1.5 rounded-full hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center">
                      <Phone className="h-3 w-3 ml-1 animate-pulse" />
                      ۰۹۹۰۲۴۸۳۱۱۷
                    </a>
                  </ClickTracker>
                  <ClickTracker itemType="support" itemId="09018880438" itemName="پشتیبانی تور 2">
                    <a href="tel:09018880438" className="bg-gradient-to-r from-blue-500 to-peyk-blue-dark text-white text-xs px-3 py-1.5 rounded-full hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center">
                      <Phone className="h-3 w-3 ml-1 animate-pulse" />
                      ۰۹۰۱۸۸۸۰۴۳۸
                    </a>
                  </ClickTracker>
                  <ClickTracker itemType="support" itemId="09017770438" itemName="پشتیبانی تور 3">
                    <a href="tel:09017770438" className="bg-gradient-to-r from-peyk-blue-dark to-peyk-blue text-white text-xs px-3 py-1.5 rounded-full hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center">
                      <Phone className="h-3 w-3 ml-1 animate-pulse" />
                      ۰۹۰۱۷۷۷۰۴۳۸
                    </a>
                  </ClickTracker>
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
                <img 
                  src="/enamad.jpg" 
                  alt="نماد اعتماد الکترونیکی" 
                  className="h-14 w-auto" 
                  loading="lazy"
                  width="56"
                  height="56"
                />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img 
                  src="/samadehi.png" 
                  alt="نشان ساماندهی" 
                  className="h-14 w-auto"
                  loading="lazy"
                  width="56"
                  height="56"
                />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img 
                  src="/images/havapeymaei-keshvari.png" 
                  alt="هواپیمایی کشوری" 
                  className="h-14 w-auto"
                  loading="lazy"
                  width="56"
                  height="56"
                />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img 
                  src="/images/hoghoghe-mosafer.png" 
                  alt="حقوق مسافر" 
                  className="h-14 w-auto"
                  loading="lazy"
                  width="56"
                  height="56"
                />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <img 
                  src="/images/nerkhebilit.png" 
                  alt="نرخ بلیط" 
                  className="h-14 w-auto"
                  loading="lazy"
                  width="56"
                  height="56"
                />
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
