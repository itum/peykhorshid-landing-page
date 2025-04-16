import { useState, useEffect } from 'react';

interface SectionItem {
  id: string;
  label: string;
}

const SectionNav = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  const sections: SectionItem[] = [
    { id: 'hero', label: 'صفحه اصلی' },
    { id: 'features', label: 'امکانات' },
    { id: 'guarantees', label: 'مدارک و تضامین' },
    { id: 'calculator', label: 'محاسبه اقساط' },
    { id: 'steps', label: 'مراحل دریافت' },
    { id: 'popular-routes', label: 'مسیرهای پرتردد' },
    { id: 'contact-us', label: 'تماس با ما' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // ارتفاع ویوپورت را دریافت می‌کنیم
      const viewportHeight = window.innerHeight;
      // موقعیت فعلی اسکرول + 20% ارتفاع صفحه
      const scrollPosition = window.scrollY + viewportHeight * 0.2;
      
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
    <div className="fixed top-1/2 left-8 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full p-3 space-y-5">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleClick(e, section.id)}
            className="block relative group section-item"
            aria-label={section.label}
          >
            <div 
              className={`w-4 h-4 rounded-full mx-auto transition-all duration-500 
                ${activeSection === section.id 
                  ? 'bg-peyk-yellow scale-125 active-dot' 
                  : 'bg-gray-300 hover:bg-gray-400'}`
              }
            >
              {/* نمایش نام بخش در حالت هاور و اکتیو */}
              <div 
                className={`absolute top-1/2 left-9 transform -translate-y-1/2 whitespace-nowrap bg-peyk-yellow text-white text-xs py-1.5 px-3 rounded section-tooltip ${activeSection === section.id ? 'section-label-animation opacity-100 visible' : ''}`}
              >
                {section.label}
                <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 border-8 border-transparent border-l-peyk-yellow"></div>
              </div>
            </div>

            {/* خط اتصال */}
            {section.id !== sections[sections.length - 1].id && (
              <div className="h-10 w-px bg-gray-300 mx-auto mt-1"></div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SectionNav; 