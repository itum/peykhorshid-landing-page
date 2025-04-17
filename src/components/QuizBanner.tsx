import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, CalendarDays, Gift } from 'lucide-react';

const QuizBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const bannerInitializedRef = useRef(false);

  useEffect(() => {
    // بررسی وضعیت کوییز کاربر
    const userData = localStorage.getItem('travel_quiz_user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.quizCompleted && parsedData.destination) {
          setHasCompletedQuiz(true);
          setDestination(parsedData.destination);
        }
      } catch (error) {
        console.error('Error parsing quiz data:', error);
      }
    }

    // راه‌اندازی observer برای مخفی کردن بنر هنگام بازگشت به بخش hero
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // اگر در بخش هیرو هستیم، کارت را مخفی کن
          setIsVisible(false);
        } else if (bannerInitializedRef.current) {
          // اگر از بخش هیرو خارج شدیم و قبلاً سایت بارگذاری شده، کارت را نمایش بده
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // وقتی 30% از بخش مورد نظر قابل مشاهده باشد
    );

    // یافتن و مشاهده بخش hero
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroObserver.observe(heroSection);
    }

    // یک تایمر کوتاه قرار می‌دهیم تا بعد از بارگذاری اولیه، بنر را فعال کنیم
    setTimeout(() => {
      bannerInitializedRef.current = true;
      
      // اگر در حال حاضر در بخش هیرو نیستیم، کارت را نمایش بده
      const heroIsVisible = heroSection ? 
        heroSection.getBoundingClientRect().top < window.innerHeight && 
        heroSection.getBoundingClientRect().bottom > 0 : false;
      
      if (!heroIsVisible) {
        setIsVisible(true);
      }
    }, 1000);

    return () => {
      heroObserver.disconnect();
    };
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 w-auto md:max-w-sm animate-slide-up">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-peyk-blue to-peyk-blue-dark px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="text-peyk-yellow h-5 w-5 mr-2" />
            <h3 className="text-white font-bold text-lg">کوییز سفر رویایی</h3>
          </div>
          <button
            onClick={closePopup}
            className="text-white/80 hover:text-white focus:outline-none"
            aria-label="بستن"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {hasCompletedQuiz ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-peyk-blue h-5 w-5 flex-shrink-0" />
                <p className="text-gray-700 text-sm md:text-base">شما قبلاً در کوییز شرکت کرده‌اید و مقصد پیشنهادی شما <span className="font-bold text-peyk-blue">{destination}</span> است.</p>
              </div>
              <div className="flex justify-end space-x-2 space-x-reverse mt-3">
                <Link to="/quiz" className="w-full">
                  <Button variant="outline" size="sm" className="border-peyk-blue text-peyk-blue">
                    انجام مجدد کوییز
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm md:text-base">مقصد سفر بعدی خود را با کوییز هوشمند ما کشف کنید!</p>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm md:text-base">با تکمیل کوییز، پیشنهاد ویژه تور دریافت کنید.</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Link to="/quiz" className="w-full">
                  <Button className="bg-gradient-to-r from-peyk-yellow to-peyk-yellow-light text-peyk-blue-dark font-bold w-full">
                    شروع کوییز سفر
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBanner;