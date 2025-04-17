import { CreditCard, Clock, Shield, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Features = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      icon: <CreditCard className="h-10 w-10 text-peyk-blue" />,
      title: "تا سقف ۱۰۰ میلیون تومان",
      description: "وام سفر برای تورهای خارجی خاص به اروپا، آفریقا و آمریکای جنوبی"
    },
    {
      icon: <Shield className="h-10 w-10 text-peyk-blue" />,
      title: "۲۰ تا ۸۰ میلیون تومان",
      description: "برای سفرهای داخلی و سایر تورهای خارجی با شرایط آسان"
    },
    {
      icon: <Clock className="h-10 w-10 text-peyk-blue" />,
      title: "بازپرداخت ۶ تا ۲۴ ماه",
      description: "امکان انتخاب مدت بازپرداخت مناسب با نیاز و توان مالی شما"
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-peyk-blue" />,
      title: "فقط با چک صیادی",
      description: "نیاز به چک صیادی ثبت شده داری"
    },
  ];

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">طرح جامع وام سفر پیک خورشید</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          به رویای سفرهای خود جامه عمل بپوشانید. بدون نیاز به ضامن فقط با یک چک ضمانت !
          </p>
        </div>

        {isMobile ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 }
            }}
            dir="rtl"
            className="pb-12"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className="feature-card text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;
