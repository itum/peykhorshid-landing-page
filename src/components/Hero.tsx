import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Plane, Map } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      id="hero" 
      className="relative pt-8 pb-12 md:py-16 lg:section-padding overflow-hidden"
      style={{
        minHeight: "100vh"
      }}
    >
      {/* تصویر پس‌زمینه */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url('/images/hero-image.jpg')`,
          filter: 'brightness(0.6)'
        }}
      ></div>
      
      {/* گرادیان جهت خوانایی بهتر متن‌ها */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-peyk-blue-dark/70 to-transparent z-10"
      ></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-12">
          <div className="w-full lg:w-1/2 text-white bg-peyk-blue-dark/50 backdrop-blur-md rounded-xl p-5 md:p-6 lg:p-8 mt-4 md:mt-8 lg:mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              طرح جامع وام سفر
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8">
              با «پیک خورشید اهواز» به رویای سفرهای خود جامه عمل بپوشانید.
              <br className="hidden sm:block" />
              فقط با سفته الکترونیکی، بدون نیاز به ضامن یا چک!
            </p>
            
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-5 mb-4 md:mb-6 shadow-lg">
              <h3 className="font-bold text-lg md:text-xl text-peyk-yellow mb-1 md:mb-2">تورهای خارجی خاص</h3>
              <p className="text-sm md:text-base">تا سقف ۱۰۰ میلیون تومان برای سفر به اروپا، آفریقا و آمریکای جنوبی</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-5 mb-6 md:mb-8 shadow-lg">
              <h3 className="font-bold text-lg md:text-xl text-peyk-yellow mb-1 md:mb-2">تورهای داخلی و خارجی عمومی</h3>
              <p className="text-sm md:text-base">از ۲۰ تا ۸۰ میلیون تومان برای سفرهای داخلی و سایر تورهای خارجی</p>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
              <Button className="bg-peyk-yellow hover:bg-peyk-yellow-light text-peyk-blue-dark font-bold px-4 sm:px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full xs:w-auto">
                درخواست وام سفر
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 px-4 sm:px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full xs:w-auto">
                مشاهده جزئیات
              </Button>
            </div>
          </div>
          
          {/* کارت محاسبه سریع - کارت در موبایل به زیر باکس اصلی منتقل می‌شود */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-full max-w-md">
              <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-2xl animate-float">
                <div className="flex flex-col gap-4 md:gap-5">
                  <div className="border-b border-gray-100 pb-3 md:pb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-peyk-blue-dark mb-2 md:mb-3">محاسبه سریع اقساط</h2>
                    <p className="text-sm md:text-base text-gray-600">بررسی اولیه مبلغ اقساط بر اساس تور مورد نظر</p>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 bg-gray-50 p-3 rounded-lg">
                    <Plane className="text-peyk-blue h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">تورهای خارجی خاص</p>
                      <p className="text-lg md:text-xl font-bold text-peyk-blue">تا ۱۰۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 bg-gray-50 p-3 rounded-lg">
                    <Map className="text-peyk-blue h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">تورهای داخلی و خارجی</p>
                      <p className="text-lg md:text-xl font-bold text-peyk-blue">۲۰ تا ۸۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 bg-gray-50 p-3 rounded-lg">
                    <Calendar className="text-peyk-blue h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">بازپرداخت</p>
                      <p className="text-lg md:text-xl font-bold text-peyk-blue">۶ تا ۲۴ ماه</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-peyk-yellow to-peyk-yellow-light text-peyk-blue-dark font-bold w-full py-4 md:py-5 mt-1 md:mt-2 hover:shadow-lg transition-all duration-300 text-base md:text-lg">
                    همین حالا درخواست دهید
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
