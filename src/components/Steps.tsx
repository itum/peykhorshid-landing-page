
import { ClipboardCheck, Upload, CheckCircle, CreditCard, ShoppingBag } from 'lucide-react';

const Steps = () => {
  const steps = [
    {
      icon: <ClipboardCheck className="h-12 w-12 text-peyk-blue" />,
      title: "ثبت‌نام در سایت",
      description: "فرم ثبت‌نام را پر کنید و حساب کاربری خود را بسازید"
    },
    {
      icon: <Upload className="h-12 w-12 text-peyk-blue" />,
      title: "آپلود مدارک",
      description: "فرم درخواست را تکمیل کرده و مدارک لازم را بارگذاری کنید"
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-peyk-blue" />,
      title: "اعتبارسنجی آنلاین",
      description: "اطلاعات شما به صورت آنلاین اعتبارسنجی می‌شود"
    },
    {
      icon: <CreditCard className="h-12 w-12 text-peyk-blue" />,
      title: "امضای قرارداد و دریافت کارت",
      description: "قرارداد را امضا کرده و کارت اعتباری خود را دریافت کنید"
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-peyk-blue" />,
      title: "خرید و پرداخت اقساط",
      description: "از فروشگاه‌های طرف قرارداد خرید کنید و اقساط ماهانه را بپردازید"
    }
  ];

  return (
    <section id="steps" className="section-padding gradient-blue text-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">مراحل دریافت وام</h2>
          <p className="max-w-2xl mx-auto">
            دریافت وام از پیک خورشید اهواز ساده و سریع است. فقط این مراحل را دنبال کنید:
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white/30 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
