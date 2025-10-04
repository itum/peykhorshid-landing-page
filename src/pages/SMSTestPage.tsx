import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sendSMS, sendSMSAlternative } from '@/lib/services/userService';

const SMSTestPage = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<'pattern' | 'text'>('pattern');

  const validatePhone = (value: string) => {
    const regex = /^09[0-9]{9}$/;
    return regex.test(value);
  };

  const handleTest = async () => {
    if (!validatePhone(phone)) {
      setResult('شماره موبایل معتبر نیست!');
      return;
    }

    setIsLoading(true);
    setResult('در حال ارسال پیامک...');

    try {
      let success = false;
      
      if (method === 'pattern') {
        // ارسال با الگو
        success = await sendSMS(phone, name);
      } else {
        // ارسال متنی
        success = await sendSMSAlternative(phone, name);
      }

      if (success) {
        setResult('پیامک با موفقیت ارسال شد!');
      } else {
        setResult('خطا در ارسال پیامک. لطفاً کنسول مرورگر را بررسی کنید.');
      }
    } catch (error) {
      console.error('خطا در ارسال پیامک (صفحه تست):', error);
      setResult(`خطا در ارسال پیامک: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRawTest = () => {
    // تست مستقیم با باز کردن URL در تب جدید
    const apiKey = import.meta.env.VITE_KAVENEGAR_API_KEY;
    
    if (!apiKey) {
      alert('❌ خطا: متغیر محیطی VITE_KAVENEGAR_API_KEY تنظیم نشده است');
      return;
    }
    
    const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${encodeURIComponent(phone)}&template=Smsvorod&token=${encodeURIComponent(name || 'کاربر گرامی')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">تست ارسال پیامک</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                این صفحه برای تست ارسال پیامک با استفاده از سرویس کاوه نگار است.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">شماره موبایل</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 09123456789"
                    dir="ltr"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">نام (پارامتر توکن)</label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد محمدی"
                    dir="rtl"
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={method === 'pattern'}
                      onChange={() => setMethod('pattern')}
                      className="ml-2"
                    />
                    <span>ارسال با الگو</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={method === 'text'}
                      onChange={() => setMethod('text')}
                      className="ml-2"
                    />
                    <span>ارسال متنی</span>
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleTest} 
                    disabled={isLoading} 
                    className="bg-peyk-blue hover:bg-peyk-blue-dark"
                  >
                    {isLoading ? 'در حال ارسال...' : 'ارسال پیامک'}
                  </Button>
                  
                  <Button 
                    onClick={handleRawTest} 
                    variant="outline" 
                    className="border-peyk-blue text-peyk-blue"
                  >
                    تست URL مستقیم
                  </Button>
                </div>
                
                {result && (
                  <div className={`p-3 rounded ${result.includes('موفقیت') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result}
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h3 className="text-lg font-medium mb-2">راهنمای عیب‌یابی</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>اطمینان حاصل کنید که API Key کاوه نگار معتبر است</li>
                    <li>بررسی کنید که الگوی "abaadikala" در پنل کاربری کاوه نگار شما فعال باشد</li>
                    <li>در صورت خطا، وضعیت اعتبار حساب کاوه نگار را بررسی کنید</li>
                    <li>کنسول مرورگر (F12) را برای مشاهده جزئیات خطا بررسی کنید</li>
                    <li>گاهی ممکن است CORS یا مشکلات شبکه باعث خطا شود</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SMSTestPage; 