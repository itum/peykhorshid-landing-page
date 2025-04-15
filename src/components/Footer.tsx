
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">پیک خورشید اهواز</h3>
            <p className="mb-4">سامانه خرید اقساطی آنلاین بدون ضامن و چک، با سفته الکترونیکی</p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-peyk-blue hover:text-peyk-blue-dark" aria-label="اینستاگرام">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-peyk-blue hover:text-peyk-blue-dark" aria-label="توییتر">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-peyk-blue hover:text-peyk-blue-dark" aria-label="لینکدین">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">خدمات ما</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-peyk-blue">وام خرید کالا</a></li>
              <li><a href="#" className="hover:text-peyk-blue">فروشگاه‌های طرف قرارداد</a></li>
              <li><a href="#" className="hover:text-peyk-blue">محاسبه اقساط</a></li>
              <li><a href="#" className="hover:text-peyk-blue">سوالات متداول</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">لینک‌های مفید</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-peyk-blue">درباره ما</a></li>
              <li><a href="#" className="hover:text-peyk-blue">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-peyk-blue">حریم خصوصی</a></li>
              <li><a href="#" className="hover:text-peyk-blue">تماس با ما</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 ml-2 text-peyk-blue" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 ml-2 text-peyk-blue" />
                <span>support@peykhorshid.ir</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 ml-2 text-peyk-blue" />
                <span>اهواز، خیابان اصلی، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p>تمامی حقوق محفوظ است © ۱۴۰۳ پیک خورشید اهواز</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
