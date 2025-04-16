import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // نمایش دکمه زمانی که کاربر بیش از 300 پیکسل اسکرول کرده باشد
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // اضافه کردن ایونت لیسنر برای اسکرول
    window.addEventListener('scroll', handleScroll);

    // پاکسازی ایونت لیسنر هنگام آنمانت کامپوننت
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // اسکرول به بالای صفحه با انیمیشن
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-top-btn ${showButton ? 'visible' : ''} hover:bg-peyk-blue-light active:bg-peyk-blue-dark focus:outline-none transition-all duration-300`}
      aria-label="بازگشت به بالای صفحه"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop; 