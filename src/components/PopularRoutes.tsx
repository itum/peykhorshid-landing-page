import { Phone, Mail, MapPin, Clock, ChevronDown, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';

const PopularRoutes = () => {
  const [activeTab, setActiveTab] = useState<'domestic' | 'special'>('domestic');

  // دیتای مسیرهای پرتردد داخلی
  const domesticRoutes = [
    { to: "کیش", price: "۳" },
    { to: "مشهد", price: "۱.۵" },
    { to: "شیراز", price: "۲" },
    { to: "اصفهان", price: "۲.۲" }
  ];

  // دیتای مسیرهای پرتردد خاص
  const specialRoutes = [
    { to: "استانبول", price: "۳.۵" },
    { to: "آنتالیا", price: "۳.۲" },
    { to: "دبی", price: "۴" },
    { to: "تایلند", price: "۳.۹" },
    { to: "ارمنستان", price: "۲.۸" },
    { to: "گرجستان", price: "۳.۱" },
    { to: "روسیه", price: "۳.۶" },
    { to: "آذربایجان", price: "۲.۹" },
    { to: "قزاقستان", price: "۳.۳" },
    { to: "اروپا", price: "۴" }
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
    <section id="popular-routes" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">پرفروش‌ترین بلیط‌های پرواز</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'domestic' ? domesticRoutes : specialRoutes).map((route, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer route-card"
            >
              <div className={`p-4 ${
                'border-r-4 border-peyk-yellow'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-bold text-lg">تور {route.to}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 
                      ? 'bg-peyk-yellow/10' 
                      : activeTab === 'domestic' 
                        ? 'bg-peyk-orange/10' 
                        : 'bg-peyk-blue/10'
                  }`}>
                    <Plane className={`h-5 w-5 plane-icon ${getAnimationClass(index)} ${
                      index === 0 
                        ? 'text-peyk-yellow' 
                        : activeTab === 'domestic' 
                          ? 'text-peyk-orange' 
                          : 'text-peyk-blue'
                    }`} />
                  </div>
                </div>
                <p className="text-peyk-blue font-bold text-sm mb-2">ماهی {route.price} میلیون تومان</p>
                <p className="text-gray-500 text-sm text-left hover:text-peyk-orange transition-colors">برای اطلاعات بیشتر کلیک کن</p>
              </div>
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