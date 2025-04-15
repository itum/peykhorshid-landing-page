
import { Button } from "@/components/ui/button";
import { Smartphone } from 'lucide-react';

const AppDownload = () => {
  return (
    <section className="bg-gray-900 text-white section-padding">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">اپلیکیشن پیک خورشید اهواز</h2>
            <p className="mb-6 text-gray-300">
              با نصب اپلیکیشن پیک خورشید اهواز، به راحتی می‌توانید درخواست وام دهید، 
              وضعیت درخواست‌ها را پیگیری کنید و اقساط خود را پرداخت نمایید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2">
                <img src="https://cdn.gpteng.co/cafebazaar.png" alt="CafeBazaar" className="h-6" />
                <span>دانلود از کافه بازار</span>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 flex items-center gap-2">
                <img src="https://cdn.gpteng.co/myket.png" alt="Myket" className="h-6" />
                <span>دانلود از مایکت</span>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-peyk-blue to-peyk-orange opacity-70 blur-3xl rounded-full"></div>
              <div className="relative bg-gray-800 border-8 border-gray-700 rounded-3xl p-4 w-64 h-auto">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-700 rounded-full"></div>
                <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
                  <Smartphone className="h-16 w-16 text-peyk-blue" />
                  <h3 className="text-xl font-bold text-center">اپلیکیشن پیک خورشید</h3>
                  <p className="text-sm text-center text-gray-400">همه خدمات در جیب شما</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
