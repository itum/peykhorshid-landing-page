
import { CreditCard, Clock, Shield, ShoppingBag } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <CreditCard className="h-10 w-10 text-peyk-blue" />,
      title: "تا سقف ۲۰ میلیون تومان",
      description: "وام بدون ضامن با شرایط آسان و پرداخت سریع"
    },
    {
      icon: <Shield className="h-10 w-10 text-peyk-blue" />,
      title: "فقط با سفته معتبر",
      description: "بدون نیاز به ضامن یا چک، فقط با سفته الکترونیکی"
    },
    {
      icon: <Clock className="h-10 w-10 text-peyk-blue" />,
      title: "فرآیند کاملاً آنلاین",
      description: "ثبت‌نام، اعتبارسنجی و دریافت وام به صورت کاملاً آنلاین"
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-peyk-blue" />,
      title: "خرید از فروشگاه‌های متنوع",
      description: "امکان خرید از فروشگاه‌های آنلاین مختلف با کارت اعتباری"
    },
  ];

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">چرا پیک خورشید اهواز؟</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            با پیک خورشید اهواز، خرید اقساطی آسان‌تر از همیشه است. بدون نیاز به ضامن یا چک!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
