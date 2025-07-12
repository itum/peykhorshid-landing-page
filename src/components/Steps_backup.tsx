import { FileText, Check, CreditCard, Shield, Briefcase, User, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const Steps = () => {
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

  const steps = [
    {
      icon: <FileText className="h-16 w-16 text-white" />,
      title: "ثبت درخواست",
      description: "فرم درخواست سفر را تکمیل کرده و برنامه سفر خود را مشخص کنید"
    },
    {
      icon: <Check className="h-16 w-16 text-white" />,
      title: "تایید و برنامه‌ریزی",
      description: "برنامه سفر شما در کمتر از ۲۴ ساعت بررسی و تایید می‌شود"
    },
    {
      icon: <CreditCard className="h-16 w-16 text-white" />,
      title: "رزرو و پرداخت",
      description: "پس از تایید، رزرو شما نهایی شده و می‌توانید هزینه را پرداخت کنید"
    }
  ];

  return (
    <>
      <section id="steps" className="section-padding bg-gradient-to-b from-peyk-blue/10 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">مراحل دریافت وام</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              رزرو تور از پیک خورشید اهواز در سه گام ساده انجام می‌شود:
            </p>
          </div>

          <div className="relative">
            {isMobile ? (
              <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2 }
                }}
                dir="rtl"
                className="pb-16 steps-swiper"
              >
                {steps.map((step, index) => (
                  <SwiperSlide key={index} className="py-6">
                    <div 
                      className="flex flex-col items-center text-center group h-full bg-white rounded-xl p-6 pt-10 shadow-md hover:shadow-lg transition-all duration-300"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-peyk-blue rounded-full scale-110 opacity-20 group-hover:scale-125 group-hover:opacity-30 transition-all duration-300"></div>
                        <div className="bg-gradient-to-br from-peyk-blue to-peyk-blue-dark p-9 rounded-full mb-4 shadow-lg relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                          {step.icon}
                        </div>
                        <div className="absolute -right-3 -top-3 w-10 h-10 bg-peyk-orange text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md z-20">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600 mb-6 max-w-xs mx-auto">{step.description}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center text-center group"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-peyk-blue rounded-full scale-110 opacity-20 group-hover:scale-125 group-hover:opacity-30 transition-all duration-300"></div>
                      <div className="bg-gradient-to-br from-peyk-blue to-peyk-blue-dark p-8 rounded-full mb-4 shadow-lg relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                      <div className="absolute -right-3 -top-3 w-10 h-10 bg-peyk-orange text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md z-20">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600 mb-6 max-w-xs mx-auto">{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* بخش مدارک و تضامین */}
      <section id="guarantees" className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">مدارک و تضامین</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              شرایط و مدارک مورد نیاز اعطای وام سفر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ستون اول - مدارک */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-peyk-blue to-peyk-blue-dark p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-white h-7 w-7" />
                  <h3 className="text-xl font-bold text-white">مدارک مورد نیاز</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>تکمیل فرم مشخصات فردی</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>کپی شناسنامه وام گیرنده</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>فرم معدل حساب</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>کپی فرم ثنا</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* ستون دوم - تضامین */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-peyk-orange to-peyk-orange-dark p-4">
                <div className="flex items-center gap-3">
                  <Shield className="text-white h-7 w-7" />
                  <h3 className="text-xl font-bold text-white">تضامین</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                      <h4 className="font-bold">الف) کارکنان بخش دولتی</h4>
                    </div>
                    <p className="text-gray-600 text-sm pr-7">
                      آخرین فیش حقوقی بهمراه چک صیادی جدید طرح صیاد به تعداد اقساط
                    </p>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                      <h4 className="font-bold">ب) کارکنان بخش خصوصی</h4>
                    </div>
                    <p className="text-gray-600 text-sm pr-7">
                      گواهی اشتغال به کار، آخرین لیست بیمه پرداختی ممهور به مهر
                    </p>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                      <h4 className="font-bold">ج) صاحبان کسب و کار</h4>
                    </div>
                    <p className="text-gray-600 text-sm pr-7">
                      پروانه کسب معتبر با چک صیادی جدید طرح صیاد به تعداد اقساط
                    </p>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-center mb-3">نوع تضمین</h4>
                    <p className="text-gray-600 text-sm text-center">
                      واگذاری چک صیادی طرح صیادی بنفش به تعداد اقساط با کارمزد هرچک صیادی ۴ درصد
                    </p>
                    <p className="text-gray-600 text-sm text-center mt-2">
                      یک چک صیادی ضمانت به مبلغ کل اقساط
                    </p>
                    <p className="text-gray-600 text-sm text-center mt-2 font-medium">
                      باز پرداخت اقساط ۶ الی ۲۴ ماه
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Steps;
