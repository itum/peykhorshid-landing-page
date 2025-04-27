import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { id: 'hero', label: 'صفحه اصلی' },
    { id: 'features', label: 'امکانات' },
    { id: 'popular-routes', label: 'پرفروش‌ترین تورها' },
    { id: 'calculator', label: 'محاسبه اقساط' },
    { id: 'steps', label: 'مراحل دریافت وام' },
    { id: 'guarantees', label: 'مدارک و تضامین' },
    { id: 'contact-us', label: 'تماس با ما' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!isHomePage) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // تشخیص بخش فعال بر اساس موقعیت اسکرول
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(item.id);
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
  }, [navItems, isHomePage]);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    if (!isHomePage) {
      // اگر در صفحه اصلی نیستیم، به صفحه اصلی هدایت شویم
      window.location.href = `/${targetId ? '#' + targetId : ''}`;
      return;
    }
    
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // بستن منوی موبایل اگر باز است
      if (isMenuOpen) {
        toggleMenu();
      }
      
      window.scrollTo({
        top: targetElement.offsetTop - 80, // فاصله از بالا را برای هدر تنظیم می‌کند
        behavior: 'smooth',
      });
      
      // اضافه کردن پارامتر به URL بدون رفرش صفحه
      window.history.pushState({}, '', `#${targetId}`);
      setActiveSection(targetId);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm py-4 px-6 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {isHomePage ? (
            <a href="#hero" className="flex items-center" onClick={(e) => smoothScroll(e, 'hero')}>
              <img 
                src="/peykhorshid-logo.png" 
                alt="پیک خورشید اهواز" 
                className="hover:scale-105 transition-transform duration-300"
                width="250"
                height="80"
              />
            </a>
          ) : (
            <Link to="/" className="flex items-center">
              <img 
                src="/peykhorshid-logo.png" 
                alt="پیک خورشید اهواز" 
                className="hover:scale-105 transition-transform duration-300"
                width="250"
                height="80"
              />
            </Link>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          {navItems.map((item) => (
            isHomePage ? (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className={`relative group px-2 py-1 ${activeSection === item.id ? 'text-peyk-orange font-medium nav-link-active' : 'text-gray-700 hover:text-peyk-orange'} transition-colors`}
                onClick={(e) => smoothScroll(e, item.id)}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-peyk-orange group-hover:w-full transition-all duration-300 ${activeSection === item.id ? 'w-full width-grow' : ''}`}></span>
              </a>
            ) : (
              <Link 
                key={item.id}
                to={`/#${item.id}`}
                className={`relative group px-2 py-1 text-gray-700 hover:text-peyk-orange transition-colors`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-peyk-orange group-hover:w-full transition-all duration-300`}></span>
              </Link>
            )
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 bg-white shadow-md py-4 px-6 z-50 animate-fadeInDown">
          <div className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              isHomePage ? (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative overflow-hidden group pb-2 ${activeSection === item.id ? 'text-peyk-orange font-medium' : 'text-gray-700 hover:text-peyk-orange'} transition-colors`}
                  onClick={(e) => smoothScroll(e, item.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                  <span className={`absolute bottom-0 right-0 w-0 h-0.5 bg-peyk-orange group-hover:w-full transition-all duration-300 ${activeSection === item.id ? 'w-full width-grow' : ''}`}></span>
                </a>
              ) : (
                <Link 
                  key={item.id}
                  to={`/#${item.id}`}
                  className={`relative overflow-hidden group pb-2 text-gray-700 hover:text-peyk-orange transition-colors`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                  <span className={`absolute bottom-0 right-0 w-0 h-0.5 bg-peyk-orange group-hover:w-full transition-all duration-300`}></span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
