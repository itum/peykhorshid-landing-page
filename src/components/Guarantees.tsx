import { Check, FileText, Shield, Briefcase, User, Building } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Guarantees = () => {
  return (
    <section id="guarantees" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">مدارک و تضامین</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            آشنایی با مدارک مورد نیاز و تضامین قابل ارائه برای دریافت وام از پیک خورشید اهواز
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
                  <span>کپی کارت ملی و شناسنامه متقاضی</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>مدارک شغلی و درآمدی (بر اساس نوع شغل)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>قبض آب یا برق یا گاز محل سکونت</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>عکس پرسنلی جدید</span>
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
                    <h4 className="font-bold">کارکنان بخش دولتی</h4>
                  </div>
                  <p className="text-gray-600 text-sm pr-7">
                    آخرین فیش حقوقی بهمراه چک جدید طرح صیاد به تعداد اقساط
                  </p>
                </div>

                <Separator className="bg-gray-200" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                    <h4 className="font-bold">کارکنان بخش خصوصی</h4>
                  </div>
                  <p className="text-gray-600 text-sm pr-7">
                    گواهی اشتغال به کار، آخرین لیست بیمه پرداختی ممهور به مهر
                  </p>
                </div>

                <Separator className="bg-gray-200" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                    <h4 className="font-bold">صاحبان کسب و کار</h4>
                  </div>
                  <p className="text-gray-600 text-sm pr-7">
                    پروانه کسب معتبر با چک جدید طرح صیاد به تعداد اقساط
                  </p>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-center mb-3">نوع تضمین</h4>
                  <p className="text-gray-600 text-sm text-center">
                    واگذاری چک طرح صیادی بنفش به تعداد اقساط با کارمزد هرچک ۴ درصد
                  </p>
                  <p className="text-gray-600 text-sm text-center mt-2">
                    یک چک ضمانت به مبلغ کل اقساط
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Guarantees; 