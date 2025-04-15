
import { FileText, Check, CreditCard } from 'lucide-react';
import { Button } from './ui/button';

const Steps = () => {
  const steps = [
    {
      icon: <FileText className="h-16 w-16 text-white" />,
      title: "ثبت درخواست",
      description: "فرم درخواست را تکمیل کرده و مدارک لازم را بارگذاری کنید",
      buttonText: "ثبت‌نام"
    },
    {
      icon: <Check className="h-16 w-16 text-white" />,
      title: "اعتبارسنجی سریع",
      description: "اطلاعات شما به صورت آنلاین و در کمتر از ۲۴ ساعت اعتبارسنجی می‌شود",
      buttonText: "مشاهده وضعیت"
    },
    {
      icon: <CreditCard className="h-16 w-16 text-white" />,
      title: "دریافت تسهیلات",
      description: "پس از تایید، کارت اعتباری شما صادر شده و می‌توانید خرید کنید",
      buttonText: "شروع خرید"
    }
  ];

  return (
    <section id="steps" className="section-padding py-20 bg-gradient-to-b from-peyk-blue/10 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">مراحل دریافت وام</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            دریافت وام از پیک خورشید اهواز در سه گام ساده انجام می‌شود:
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-44 left-[10%] right-[10%] h-1 bg-peyk-blue/30 z-0"></div>
          
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
                <Button 
                  className="bg-gradient-to-r from-peyk-orange to-peyk-orange-dark hover:from-peyk-orange-dark hover:to-peyk-orange text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  {step.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
