import { Phone, Mail, MapPin, Clock, ChevronDown, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  // دیتای مسیرهای پرتردد داخلی
  const domesticRoutes: DomesticRoute[] = [
    { to: "کیش", price: "۳", image: "/city-icons/kish.jpg", link: "https://peykkhorshid.ir/kish-tour/" },
    { to: "مشهد", price: "۱.۵", image: "/city-icons/mashhad.jpg", link: "https://peykkhorshid.ir/mashhad-tour/" },
    { to: "شیراز", price: "۲", image: "/city-icons/shiraz.jpg", link: "https://peykkhorshid.ir/shiraz-tour/" },
    { to: "اصفهان", price: "۲.۲", image: "/city-icons/isfahan.jpg", link: "https://peykkhorshid.ir/isfahan/" }
  ];

  // دیتای مسیرهای پرتردد خاص
  const specialRoutes: SpecialRoute[] = [
    { to: "استانبول", price: "۳.۵", image: "/city-icons/istanbul.jpg", link: "https://peykkhorshid.ir/istanbul-tour/" },
    { to: "آنتالیا", price: "۳.۲", image: "/city-icons/antalia.jpg", link: "https://peykkhorshid.ir/antalya/" },
    { to: "دبی", price: "۴", image: "/city-icons/dubai.jpg", link: "https://peykkhorshid.ir/dubai/" },
    { to: "تایلند", price: "۳.۹", image: "/city-icons/thailand.jpg", link: "https://peykkhorshid.ir/thailand/" },
    { to: "ارمنستان", price: "۲.۸", image: "/city-icons/armenia.jpg", link: "https://peykkhorshid.ir/armenia/" },
    { to: "گرجستان", price: "۳.۱", image: "/city-icons/teflis.jpg", link: "https://peykkhorshid.ir/georgia/" },
    { to: "روسیه", price: "۳.۶", image: "/city-icons/russia.jpg", link: "https://peykkhorshid.ir/russia/" },
    // { to: "آذربایجان", price: "۲.۹" },
    { to: "قزاقستان", price: "۳.۳", image: "/city-icons/kazakhstan.jpg", link: "https://peykkhorshid.ir/tour/%D8%AA%D9%88%D8%B1-%D9%82%D8%B2%D8%A7%D9%82%D8%B3%D8%AA%D8%A7%D9%86-4-%D8%B4%D8%A8-%D9%88-5-%D8%B1%D9%88%D8%B2-%D8%A2%DA%A9%D8%AA%D8%A7%D8%A6%D9%88/" },
    { to: "پاریس", price: "۴", image: "/city-icons/paris.jpg", link: "https://peykkhorshid.ir/france/" }
  ];

  // تعیین نوع انیمیشن براساس شاخص
  const getAnimationClass = (index: number) => {
    const animations = ['fly-animation', 'bounce-animation', 'pulse-animation', 'wobble-animation'];
    return animations[index % animations.length];
  };

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

  return (
    <section id="popular-routes" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">پرفروش‌ترین تورها</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            محبوب‌ترین مسیرهای سفر داخلی و خارجی برای دریافت وام سفر پیک خورشید
          </p>
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

        {/* نمایش مسیرهای پرتردد */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === 'domestic' ? domesticRoutes : specialRoutes).map((route, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:translate-y-[-8px] hover:scale-[1.02] route-card"
            >
              {activeTab === 'domestic' ? (
                <a 
                  href={(route as DomesticRoute).link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col h-full"
                >
                  {/* بخش تصویر برای تورهای داخلی */}
                  <div className="relative overflow-hidden p-0">
                    {(route as DomesticRoute).image ? (
                      <img 
                        src={(route as DomesticRoute).image} 
                        alt={`تور ${route.to}`} 
                        className="w-full h-auto rounded-t-xl"
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
                      <p className="text-peyk-blue font-bold text-sm text-right">ماهی {route.price} میلیون تومان</p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button className="border border-peyk-blue text-peyk-blue font-medium rounded-full py-1.5 px-5 text-sm transition-all hover:bg-peyk-blue hover:text-white">
                        دریافت اطلاعات بیشتر
                      </button>
                    </div>
                  </div>
                </a>
              ) : (
                // استایل جدید برای تورهای خاص (مشابه با تورهای داخلی)
                <a 
                  href={(route as SpecialRoute).link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col h-full"
                >
                  {/* بخش تصویر برای تورهای خارجی */}
                  <div className="relative overflow-hidden p-0">
                    {(route as SpecialRoute).image ? (
                      <img 
                        src={(route as SpecialRoute).image} 
                        alt={`تور ${route.to}`} 
                        className="w-full h-auto rounded-t-xl"
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
                      <p className="text-peyk-blue font-bold text-sm text-right">ماهی {route.price} میلیون تومان</p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <span className="border border-peyk-blue text-peyk-blue font-medium rounded-full py-1.5 px-5 text-sm transition-all hover:bg-peyk-blue hover:text-white">
                        دریافت اطلاعات بیشتر
                      </span>
                    </div>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
        
        {/* دکمه درخواست وام سفر */}
        <div className="text-center mt-10">
          <button className="bg-gradient-to-r from-peyk-blue to-peyk-blue-dark hover:from-peyk-blue-dark hover:to-peyk-blue text-white py-3 px-8 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            درخواست وام سفر برای {activeTab === 'domestic' ? 'تورهای داخلی' : 'تورهای خاص'}
          </button>
          <p className="text-gray-500 mt-3 text-sm">بدون نیاز به ضامن، فقط با سفته الکترونیکی</p>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes; 