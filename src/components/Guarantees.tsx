import { Check, FileText, Shield, Briefcase, User, Building } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from 'react';
import { getSection } from '@/lib/services/contentService';

const Guarantees = () => {
  const [overrideTitle, setOverrideTitle] = useState<string | null>(null);
  const [overrideDescription, setOverrideDescription] = useState<string | null>(null);
  const [overrideDocuments, setOverrideDocuments] = useState<string[]>([]);
  const [overrideGuarantees, setOverrideGuarantees] = useState<any>({});

  useEffect(() => {
    (async () => {
      const section = await getSection('home', 'guarantees');
      if (section && section.data) {
        const data = typeof section.data === 'string' ? (() => { try { return JSON.parse(section.data); } catch { return {}; } })() : section.data;
        if (data.title) setOverrideTitle(data.title);
        if (data.description) setOverrideDescription(data.description);
        if (Array.isArray(data.documents)) setOverrideDocuments(data.documents);
        if (data.guarantees) setOverrideGuarantees(data.guarantees);
      }
    })();
  }, []);

  const documents = overrideDocuments.length > 0 ? overrideDocuments : [
    'چک صیادی بنفش',
    'فیش حقوقی ویا جواز کسب',
    'پرینت حساب سه ماهه همراه با مهر بانک',
    'کپی شناسنامه تمام صفحات',
    'کپی کارت ملی پشت و رو',
    'فرم ثنا'
  ];

  const guarantees = Object.keys(overrideGuarantees).length > 0 ? overrideGuarantees : {
    government: {
      title: 'کارکنان بخش دولتی',
      description: 'آخرین فیش حقوقی بهمراه چک صیادی جدید طرح صیاد به تعداد اقساط'
    },
    private: {
      title: 'کارکنان بخش خصوصی',
      description: 'گواهی اشتغال به کار، آخرین لیست بیمه پرداختی ممهور به مهر'
    },
    business: {
      title: 'صاحبان کسب و کار',
      description: 'پروانه کسب معتبر با چک صیادی جدید طرح صیاد به تعداد اقساط'
    }
  };

  return (
    <section id="guarantees" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
                  <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{overrideTitle || 'مدارک و تضامین'}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {overrideDescription || 'آشنایی با مدارک مورد نیاز و تضامین قابل ارائه برای دریافت وام از پیک خورشید اهواز'}
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
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-peyk-blue h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
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
                      <h4 className="font-bold">{guarantees.government?.title || 'کارکنان بخش دولتی'}</h4>
                    </div>
                    <p className="text-gray-600 text-sm pr-7">
                      {guarantees.government?.description || 'آخرین فیش حقوقی بهمراه چک صیادی جدید طرح صیاد به تعداد اقساط'}
                    </p>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                      <h4 className="font-bold">{guarantees.private?.title || 'کارکنان بخش خصوصی'}</h4>
                    </div>
                    <p className="text-gray-600 text-sm pr-7">
                      {guarantees.private?.description || 'گواهی اشتغال به کار، آخرین لیست بیمه پرداختی ممهور به مهر'}
                    </p>
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-peyk-orange h-5 w-5 flex-shrink-0" />
                      <h4 className="font-bold">{guarantees.business?.title || 'صاحبان کسب و کار'}</h4>
                    </div>
                    <p className="text-gray-600 text-sm pr-7">
                      {guarantees.business?.description || 'پروانه کسب معتبر با چک صیادی جدید طرح صیاد به تعداد اقساط'}
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