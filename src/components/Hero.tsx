
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar } from 'lucide-react';

const Hero = () => {
  return (
    <section className="blue-gradient-bg section-padding">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              وام آنلاین، بدون ضامن و چک
            </h1>
            <p className="text-lg md:text-xl mb-8">
              با «پیک خورشید اهواز» تا سقف ۱۰۰ میلیون تومان وام دریافت کنید.
              <br />
              فقط با سفته الکترونیکی، بدون نیاز به ضامن یا چک!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-peyk-orange hover:bg-peyk-orange-dark text-white px-8 py-6 text-lg">
                دریافت وام
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                بیشتر بدانید
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-peyk-orange flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-lg font-bold">۴٪</div>
                  <div className="text-xs">سود ثابت</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl animate-float">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-peyk-blue h-6 w-6" />
                    <div>
                      <p className="text-gray-500">تا سقف</p>
                      <p className="text-xl font-bold">۱۰۰ میلیون تومان</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-peyk-blue h-6 w-6" />
                    <div>
                      <p className="text-gray-500">بازپرداخت</p>
                      <p className="text-xl font-bold">۶ تا ۲۴ ماه</p>
                    </div>
                  </div>
                  <Button className="gradient-orange w-full py-5 mt-2">همین حالا شروع کنید</Button>
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
