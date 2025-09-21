import { Phone, Mail, MapPin, Clock, ChevronDown, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import ClickTracker from './ClickTracker';
import { getLocalStats } from '@/lib/services/statsService';
import { getSection } from '@/lib/services/contentService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// تعریف تایپ برای تورهای داخلی
interface DomesticRoute {
  to: string;
  price: string;
  image: string;
  link?: string;
}

// تعریف تایپ برای تورهای خاص
interface SpecialRoute {
  to: string;
  price: string;
  image?: string; // اضافه کردن فیلد تصویر برای تورهای خارجی
  link?: string;
}

// تعریف تایپ برای نوع مسیر
type RouteType = DomesticRoute | SpecialRoute;

const PopularRoutes = () => {
  const [activeTab, setActiveTab] = useState<'domestic' | 'special'>('domestic');
  const [isMobile, setIsMobile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [localStats, setLocalStats] = useState<any[]>([]);
  const [overrideTitle, setOverrideTitle] = useState<string | null>(null);
  const [overrideDescription, setOverrideDescription] = useState<string | null>(null);
  const [overrideDomesticRoutes, setOverrideDomesticRoutes] = useState<any[]>([]);
  const [overrideSpecialRoutes, setOverrideSpecialRoutes] = useState<any[]>([]);

  // دیتای مسیرهای پرتردد داخلی
  const domesticRoutes: DomesticRoute[] = overrideDomesticRoutes.length > 0 ? overrideDomesticRoutes : [
    { to: "کیش", price: "۷۵۰ هزار", image: "/city-icons/kish.jpg", link: "https://peykkhorshid.ir/kish-tour/" },
    { to: "مشهد", price: "۹۰۰ هزار", image: "/city-icons/mashhad.jpg", link: "https://peykkhorshid.ir/mashhad-tour/" },
    { to: "شیراز", price: "۶۸۰ هزار", image: "/city-icons/shiraz.jpg", link: "https://peykkhorshid.ir/shiraz-tour/" },
    { to: "اصفهان", price: "۹۰۰ هزار", image: "/city-icons/isfahan.jpg", link: "https://peykkhorshid.ir/isfahan-tour/" }
  ];

  // دیتای مسیرهای پرتردد خاص
  const specialRoutes: SpecialRoute[] = overrideSpecialRoutes.length > 0 ? overrideSpecialRoutes : [
    { to: "استانبول", price: "۱.۷۸۰", image: "/city-icons/istanbul.jpg", link: "https://peykkhorshid.ir/istanbul-tour/" },
    { to: "آنتالیا", price: "۲.۶۹۰", image: "/city-icons/antalia.jpg", link: "https://peykkhorshid.ir/antalya/" },
    { to: "دبی", price: "۲.۲۰۰", image: "/city-icons/dubai.jpg", link: "https://peykkhorshid.ir/dubai/" },
    { to: "تایلند", price: "۲.۴۰۰", image: "/city-icons/thailand.jpg", link: "https://peykkhorshid.ir/thailand/" },
    { to: "ارمنستان", price: "۱.۷۰۰", image: "/city-icons/armenia.jpg", link: "https://peykkhorshid.ir/armenia/" },
    { to: "گرجستان", price: "۱.۷۵۰", image: "/city-icons/teflis.jpg", link: "https://peykkhorshid.ir/georgia/" },
    { to: "روسیه", price: "۵.۳۰۰", image: "/city-icons/russia.jpg", link: "https://peykkhorshid.ir/russia/" },
    { to: "باکو", price: "۴.۸۰۰", image: "/city-icons/baku.jpg", link: "https://peykkhorshid.ir/azerbaijan/" },
    { to: "قزاقستان", price: "۳.۳", image: "/city-icons/kazakhstan.jpg", link: "https://peykkhorshid.ir/tour/%D8%AA%D9%88%D8%B1-%D9%82%D8%B2%D8%A7%D9%82%D8%B3%D8%AA%D8%A7%D9%86-4-%D8%B4%D8%A8-%D9%88-5-%D8%B1%D9%88%D8%B2-%D8%A2%DA%A9%D8%AA%D8%A7%D8%A6%D9%88/" },
    { to: "پاریس", price: "۴", image: "/city-icons/paris.jpg", link: "https://peykkhorshid.ir/france/" }
  ];

  // تعیین نوع انیمیشن براساس شاخص
  const getAnimationClass = (index: number) => {
    const animations = ['fly-animation', 'bounce-animation', 'pulse-animation', 'wobble-animation'];
    return animations[index % animations.length];
  };

  // بررسی اندازه صفحه و تنظیم حالت موبایل
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // تنظیم مقدار اولیه
    handleResize();
    
    // اضافه کردن event listener
    window.addEventListener('resize', handleResize);
    
    // پاکسازی
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const section = await getSection('home', 'popular_routes');
      if (section && section.data) {
        const data = typeof section.data === 'string' ? (() => { try { return JSON.parse(section.data); } catch { return {}; } })() : section.data;
        if (data.title) setOverrideTitle(data.title);
        if (data.description) setOverrideDescription(data.description);
        if (Array.isArray(data.domestic_routes)) setOverrideDomesticRoutes(data.domestic_routes);
        if (Array.isArray(data.special_routes)) setOverrideSpecialRoutes(data.special_routes);
      }
    })();
  }, []);

  // اضافه کردن استایل‌های انیمیشن به head
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes fly {
        0% { transform: translateX(0) rotate(45deg); }
        50% { transform: translateX(-10px) translateY(-5px) rotate(45deg); }
        100% { transform: translateX(0) rotate(45deg); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0) rotate(45deg); }
        50% { transform: translateY(-10px) rotate(45deg); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1) rotate(45deg); }
        50% { transform: scale(1.2) rotate(45deg); }
        100% { transform: scale(1) rotate(45deg); }
      }
      
      @keyframes wobble {
        0%, 100% { transform: rotate(45deg); }
        25% { transform: rotate(35deg); }
        75% { transform: rotate(55deg); }
      }
      
      .fly-animation {
        animation: fly 3s ease-in-out infinite;
      }
      
      .bounce-animation {
        animation: bounce 2s ease-in-out infinite;
      }
      
      .pulse-animation {
        animation: pulse 2s ease-in-out infinite;
      }
      
      .wobble-animation {
        animation: wobble 2s ease-in-out infinite;
      }
      
      .route-card:hover .plane-icon {
        animation-duration: 1s !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // متد رندر کارت تور
  const renderRouteCard = (route: RouteType, index: number, isInSwiper = false) => {
    const tourType = activeTab === 'domestic' ? 'domestic' : 'special';
    const tourId = `${tourType}-${route.to}`;
    const tourName = `تور ${route.to}`;
    
    // ایجاد تابع هندلر کلیک
    const handleCardClick = () => {
      // باز کردن لینک در پنجره جدید
      if (route.link) {
        window.open(route.link, '_blank', 'noopener,noreferrer');
      }
    };
    
    return (
      <ClickTracker 
        key={isInSwiper ? undefined : index} 
        itemType={tourType}
        itemId={tourId}
        itemName={tourName}
        className={`bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:translate-y-[-8px] hover:scale-[1.02] route-card ${isInSwiper ? 'h-full' : ''}`}
        onClick={handleCardClick}
      >
        {activeTab === 'domestic' ? (
          <div className="flex flex-col h-full">
            {/* بخش تصویر برای تورهای داخلی */}
            <div className="relative overflow-hidden p-0">
              {(route as DomesticRoute).image ? (
                <img 
                  src={(route as DomesticRoute).image} 
                  alt={`تور ${route.to}`} 
                  className="w-full h-auto rounded-t-xl"
                  loading="lazy"
                  width="350"
                  height="200"
                />
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-r from-peyk-orange/20 to-peyk-yellow/20">
                  <Plane className="h-12 w-12 text-peyk-orange/70" />
                </div>
              )}
            </div>
            
            {/* اطلاعات تور */}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div className="text-right">
                <h3 className="font-bold text-base text-gray-800 mb-1">تور {route.to}</h3>
                <p className="text-peyk-blue font-bold text-sm text-right">ماهیانه {route.price} میلیون تومان</p>
              </div>
              <div className="flex justify-end mt-4">
                <span className="border border-peyk-blue text-peyk-blue font-medium rounded-full py-1.5 px-5 text-sm transition-all hover:bg-peyk-blue hover:text-white">
                  دریافت اطلاعات بیشتر
                </span>
              </div>
            </div>
          </div>
        ) : (
          // استایل برای تورهای خاص
          <div className="flex flex-col h-full">
            {/* بخش تصویر برای تورهای خارجی */}
            <div className="relative overflow-hidden p-0">
              {(route as SpecialRoute).image ? (
                <img 
                  src={(route as SpecialRoute).image} 
                  alt={`تور ${route.to}`} 
                  className="w-full h-auto rounded-t-xl"
                  loading="lazy"
                  width="350"
                  height="200"
                />
              ) : (
                <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-r from-peyk-blue/20 to-peyk-blue-dark/20">
                  <Plane className={`h-12 w-12 plane-icon ${getAnimationClass(index)} text-peyk-blue/70`} />
                </div>
              )}
            </div>
            
            {/* اطلاعات تور */}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div className="text-right">
                <h3 className="font-bold text-base text-gray-800 mb-1">تور {route.to}</h3>
                <p className="text-peyk-blue font-bold text-sm text-right">ماهیانه {route.price} میلیون تومان</p>
              </div>
              <div className="flex justify-end mt-4">
                <span className="border border-peyk-blue text-peyk-blue font-medium rounded-full py-1.5 px-5 text-sm transition-all hover:bg-peyk-blue hover:text-white">
                  دریافت اطلاعات بیشتر
                </span>
              </div>
            </div>
          </div>
        )}
      </ClickTracker>
    );
  };

  // نمایش آمار محلی برای دیباگ
  const toggleLocalStats = () => {
    const stats = getLocalStats();
    setLocalStats(stats);
    setShowStats(!showStats);
  };

  return (
    <section id="popular-routes" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{overrideTitle || 'پرفروش‌ترین تورها'}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {overrideDescription || 'محبوب‌ترین مسیرهای سفر داخلی و خارجی پیک خورشید'}
          </p>

          {/* دکمه مخفی برای دیباگ - فقط با کلید مخفی قابل دسترسی */}
          <div className="mt-4" onDoubleClick={toggleLocalStats} style={{ cursor: 'default' }}>
            {showStats && (
              <div className="border p-4 rounded-md text-left bg-gray-50 max-h-60 overflow-y-auto">
                <h4 className="font-bold mb-2">آمار کلیک‌های محلی:</h4>
                <pre className="text-xs">
                  {JSON.stringify(localStats, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* تب‌ها */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button 
              onClick={() => setActiveTab('domestic')}
              className={`py-2 px-6 rounded-full transition-all duration-300 text-sm md:text-base ${
                activeTab === 'domestic' ? 'bg-peyk-orange text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              تور داخلی
            </button>
            <button 
              onClick={() => setActiveTab('special')}
              className={`py-2 px-6 rounded-full transition-all duration-300 text-sm md:text-base ${
                activeTab === 'special' ? 'bg-peyk-blue text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              تور خاص
            </button>
          </div>
        </div>

        {/* نمایش مسیرهای پرتردد - استفاده از Swiper برای موبایل و تبلت */}
        {isMobile ? (
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 }
            }}
            dir="rtl"
            className="pb-12"
          >
            {(activeTab === 'domestic' ? domesticRoutes : specialRoutes).map((route, index) => (
              <SwiperSlide key={index}>
                {renderRouteCard(route, index, true)}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // نمایش گرید برای دسکتاپ
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'domestic' ? domesticRoutes : specialRoutes).map((route, index) => (
              renderRouteCard(route, index)
            ))}
          </div>
        )}
        
        {/* دکمه درخواست سفر */}
        <div className="text-center mt-10">
          <a 
            href={activeTab === 'domestic' 
              ? "https://peykkhorshid.ir/tour-category/internal-tours/" 
              : "https://peykkhorshid.ir/tour-category/foreign-tours/"}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gradient-to-r from-peyk-blue to-peyk-blue-dark hover:from-peyk-blue-dark hover:to-peyk-blue text-white py-3 px-8 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-block"
          >
            مشاهده تورهای {activeTab === 'domestic' ? 'داخلی' : 'خاص'} پیک خورشید
          </a>
          <p className="text-gray-500 mt-3 text-sm">برنامه‌ریزی آسان و مطمئن برای سفر رویایی شما</p>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes; 