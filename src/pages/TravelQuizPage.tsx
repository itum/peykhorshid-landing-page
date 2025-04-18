import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import TravelQuiz from "@/components/TravelQuiz";
import { useEffect } from "react";

const TravelQuizPage = () => {
  // اسکرول به بالای صفحه به محض ورود
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">کوییز سفر رویایی</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                به کمک این کوییز کوتاه، می‌توانید بهترین مقصد سفر برای خود را پیدا کنید و از خدمات تور پیک خورشید بهره‌مند شوید.
              </p>
            </div>
            
            <TravelQuiz />
            
            <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-3">با تورهای پیک خورشید، سفر رویایی خود را تجربه کنید</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">•</span>
                  <span>تورهای داخلی و خارجی با بهترین قیمت</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">•</span>
                  <span>مقاصد متنوع برای سلیقه‌های مختلف</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">•</span>
                  <span>خدمات ویژه و اختصاصی برای مسافران</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 ml-2">•</span>
                  <span>برنامه‌ریزی سفر و رزرو آنلاین آسان</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TravelQuizPage; 