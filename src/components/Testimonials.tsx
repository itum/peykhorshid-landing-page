
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "الهام محمدی",
      role: "مشتری",
      text: "من به راحتی توانستم وام خود را دریافت کنم و گوشی موبایل جدیدم را خریداری کنم. تمام مراحل آنلاین و بدون نیاز به رفت و آمد انجام شد.",
      rating: 5
    },
    {
      name: "محمد پارسا",
      role: "مشتری",
      text: "تجربه بسیار خوبی با پیک خورشید اهواز داشتم. ظرف ۲۴ ساعت وامم تایید شد و توانستم خرید خود را انجام دهم.",
      rating: 5
    },
    {
      name: "ندا رضایی",
      role: "مشتری",
      text: "اقساط معقول و پشتیبانی عالی! من لپ‌تاپی که برای کارم نیاز داشتم را با اقساط مناسب خریداری کردم.",
      rating: 4
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">نظرات مشتریان ما</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ببینید مشتریان ما درباره خدمات پیک خورشید اهواز چه می‌گویند:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div className="border-t pt-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
