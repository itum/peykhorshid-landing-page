import { useState, useEffect, useRef } from 'react';

interface SectionItem {
  id: string;
  label: string;
}

const SectionNav = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  const sections: SectionItem[] = [
    { id: 'hero', label: 'صفحه اصلی' },
    { id: 'features', label: 'امکانات' },
    { id: 'popular-routes', label: 'پرفروش‌ترین تورها' },
    { id: 'calculator', label: 'محاسبه اقساط' },
    { id: 'steps', label: 'مراحل دریافت وام' },
    { id: 'guarantees', label: 'مدارک و تضامین' },
    { id: 'contact-us', label: 'تماس با ما' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // ارتفاع ویوپورت را دریافت می‌کنیم
      const viewportHeight = window.innerHeight;
      // موقعیت فعلی اسکرول + 20% ارتفاع صفحه
      const scrollPosition = window.scrollY + viewportHeight * 0.2;
      
      // نمایش منوی کناری بر اساس موقعیت اسکرول
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        const featuresTop = featuresSection.offsetTop;
        setIsVisible(scrollPosition >= featuresTop);
      }
      
      // بررسی موقعیت بخش‌های مختلف و تعیین بخش فعال
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          // بخش فعال را زمانی تعیین می‌کنیم که ۲۰٪ ویوپورت به آن رسیده باشد
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
      
      // اگر به انتهای صفحه رسیده‌ایم، آخرین بخش را فعال می‌کنیم
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        setActiveSection(sections[sections.length - 1].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // اجرای اولیه برای تعیین بخش فعال
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    
    if (targetElement) {
      // مقدار آفست را تنظیم می‌کنیم تا بخش کامل نمایش داده شود
      const offset = 50; // آفست کمتر برای نمایش کامل‌تر بخش‌ها
      
      window.scrollTo({
        top: targetElement.offsetTop - offset,
        behavior: 'smooth'
      });
      
      // تغییر URL بدون رفرش صفحه
      window.history.pushState({}, '', `#${id}`);
      
      // بعد از اسکرول، بخش فعال را تنظیم می‌کنیم
      setActiveSection(id);
    }
  };

  return (
    <div 
      ref={navRef}
      className={`fixed left-[20px] bottom-[85px] z-40 hidden md:block section-nav-transition ${
        isVisible ? 'section-nav-visible' : 'section-nav-hidden'
      }`}
    >
      <div className="bg-white/70 backdrop-blur-sm shadow-md rounded-full px-3 py-4 flex flex-col items-center gap-5">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleClick(e, section.id)}
            className="relative group flex items-center justify-center"
            aria-label={section.label}
          >
            <div 
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id 
                  ? 'bg-peyk-yellow scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {/* نمایش نام بخش در حالت هاور */}
              <div 
                className="absolute top-1/2 left-8 transform -translate-y-1/2 whitespace-nowrap bg-peyk-yellow text-white text-[10px] md:text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              >
                {section.label}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SectionNav; 