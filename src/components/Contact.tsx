
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تماس با ما</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            برای اطلاعات بیشتر و پاسخ به سوالات خود، با ما در تماس باشید:
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-bold mb-6">اطلاعات تماس</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="bg-peyk-blue/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-peyk-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">شماره تماس</h4>
                    <p className="text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="bg-peyk-blue/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-peyk-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">ایمیل</h4>
                    <p className="text-gray-600">support@peykhorshid.ir</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="bg-peyk-blue/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-peyk-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">آدرس</h4>
                    <p className="text-gray-600">اهواز، خیابان اصلی، پلاک ۱۲۳</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="bg-peyk-blue/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-peyk-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">ساعات کاری</h4>
                    <p className="text-gray-600">شنبه تا چهارشنبه: ۹ صبح تا ۵ عصر</p>
                    <p className="text-gray-600">پنجشنبه: ۹ صبح تا ۱ بعدازظهر</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="gradient-blue p-8 md:p-10 text-white">
              <h3 className="text-2xl font-bold mb-6">پشتیبانی آنلاین</h3>
              <p className="mb-6">
                مشاوران ما در ساعات کاری آماده پاسخگویی به سوالات شما هستند. 
                از طریق فرم زیر با ما در ارتباط باشید:
              </p>
              
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="نام و نام خانوادگی" 
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="ایمیل" 
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="پیام شما" 
                    rows={4}
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-white text-peyk-blue font-bold rounded-lg hover:bg-white/90 transition-colors"
                >
                  ارسال پیام
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
