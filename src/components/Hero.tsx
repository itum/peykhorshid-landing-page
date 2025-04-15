import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Plane, Map } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="hero-bg section-padding min-h-screen flex items-center relative overflow-hidden">
      {/* نورهای پس‌زمینه */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-peyk-blue/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-peyk-yellow/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-peyk-blue/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-white">
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20 shadow-glass">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                طرح جامع وام سفر
              </h1>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                با «پیک خورشید اهواز» به رویای سفرهای خود جامه عمل بپوشانید.
                <br />
                فقط با سفته الکترونیکی، بدون نیاز به ضامن یا چک!
              </p>
              
              <div className="glassmorphism-card mb-6">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-peyk-yellow/80 rounded-full blur-sm"></div>
                <h3 className="font-bold text-xl text-peyk-yellow mb-2">تورهای خارجی خاص</h3>
                <p className="mb-1 text-white/80">تا سقف ۱۰۰ میلیون تومان برای سفر به اروپا، آفریقا و آمریکای جنوبی</p>
              </div>
              
              <div className="glassmorphism-card mb-6">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-peyk-blue/80 rounded-full blur-sm"></div>
                <h3 className="font-bold text-xl text-peyk-yellow mb-2">تورهای داخلی و خارجی عمومی</h3>
                <p className="mb-1 text-white/80">از ۲۰ تا ۸۰ میلیون تومان برای سفرهای داخلی و سایر تورهای خارجی</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="glass-button-primary">
                  درخواست وام سفر
                </Button>
                <Button className="glass-button-secondary">
                  مشاهده جزئیات
                </Button>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-8 -right-8 w-24 h-24 backdrop-blur-xl bg-peyk-blue/30 rounded-full flex items-center justify-center text-white border border-white/20 shadow-glass">
                <div className="text-center">
                  <div className="text-2xl font-bold">۴٪</div>
                  <div className="text-xs">سود ثابت</div>
                </div>
              </div>
              <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20 shadow-glass hover:shadow-glass-hover transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex flex-col gap-6">
                  <div className="glassmorphism-item">
                    <Plane className="text-peyk-yellow h-7 w-7" />
                    <div>
                      <p className="text-gray-200">تورهای خارجی خاص</p>
                      <p className="text-xl font-bold text-white">تا ۱۰۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="glassmorphism-item">
                    <Map className="text-peyk-yellow h-7 w-7" />
                    <div>
                      <p className="text-gray-200">تورهای داخلی و خارجی</p>
                      <p className="text-xl font-bold text-white">۲۰ تا ۸۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="glassmorphism-item">
                    <Calendar className="text-peyk-yellow h-7 w-7" />
                    <div>
                      <p className="text-gray-200">بازپرداخت</p>
                      <p className="text-xl font-bold text-white">۶ تا ۲۴ ماه</p>
                    </div>
                  </div>
                  <Button className="glass-button-glow w-full py-5 mt-4">همین حالا درخواست دهید</Button>
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
