import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // نمایش/عدم نمایش دکمه با توجه به موقعیت اسکرول
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // اسکرول به بالای صفحه با انیمیشن
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-top-btn ${isVisible ? 'visible bounce-animation' : ''} hover:bg-peyk-blue-dark transition-colors`}
      aria-label="اسکرول به بالای صفحه"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTop; 