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
    { id: 'calculator', label: 'محاسبه اقساط' },
    { id: 'steps', label: 'مراحل دریافت' },
    { id: 'contact', label: 'تماس با ما' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // بررسی موقعیت بخش‌های مختلف و تعیین بخش فعال
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
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
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // تغییر URL بدون رفرش صفحه
      window.history.pushState({}, '', `#${id}`);
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