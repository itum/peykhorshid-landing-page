import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Plane, Map } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      id="hero" 
      className="relative section-padding overflow-hidden"
      style={{
        minHeight: "100vh"
      }}
    >
      {/* تصویر پس‌زمینه */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url('/images/hero-image.jpg')`,
          filter: 'brightness(0.4)'
        }}
      ></div>
      
      {/* گرادیان جهت خوانایی بهتر متن‌ها */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-peyk-blue-dark/80 to-peyk-blue/60 z-10"
      ></div>
      
      <div className="container mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              طرح جامع وام سفر
            </h1>
            <p className="text-lg md:text-xl mb-6">
              با «پیک خورشید اهواز» به رویای سفرهای خود جامه عمل بپوشانید.
              <br />
              فقط با سفته الکترونیکی، بدون نیاز به ضامن یا چک!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <h3 className="font-bold text-xl text-peyk-yellow mb-2">تورهای خارجی خاص</h3>
              <p className="mb-1">تا سقف ۱۰۰ میلیون تومان برای سفر به اروپا، آفریقا و آمریکای جنوبی</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <h3 className="font-bold text-xl text-peyk-yellow mb-2">تورهای داخلی و خارجی عمومی</h3>
              <p className="mb-1">از ۲۰ تا ۸۰ میلیون تومان برای سفرهای داخلی و سایر تورهای خارجی</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-peyk-blue hover:bg-peyk-blue-dark text-white px-8 py-6 text-lg">
                درخواست وام سفر
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                مشاهده جزئیات
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white p-6 rounded-2xl shadow-xl animate-float">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Plane className="text-peyk-blue h-6 w-6" />
                    <div>
                      <p className="text-gray-500">تورهای خارجی خاص</p>
                      <p className="text-xl font-bold">تا ۱۰۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Map className="text-peyk-blue h-6 w-6" />
                    <div>
                      <p className="text-gray-500">تورهای داخلی و خارجی</p>
                      <p className="text-xl font-bold">۲۰ تا ۸۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-peyk-blue h-6 w-6" />
                    <div>
                      <p className="text-gray-500">بازپرداخت</p>
                      <p className="text-xl font-bold">۶ تا ۲۴ ماه</p>
                    </div>
                  </div>
                  <Button className="gradient-blue w-full py-5 mt-2">همین حالا درخواست دهید</Button>
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
