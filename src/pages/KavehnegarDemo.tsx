import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const KavehnegarDemo = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_KAVENEGAR_API_KEY || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('تست پیامک از سایت پیک خورشید');
  const [token, setToken] = useState('');
  const [template, setTemplate] = useState('Smsvorod');
  const [sender, setSender] = useState('10008663');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  // تست مستقیم GET
  const testDirectGet = async () => {
    setLoading(true);
    setResult('در حال ارسال درخواست...');
    
    try {
      const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}&sender=${encodeURIComponent(sender)}`;
      
      setResult(`درخواست ایجاد شد. URL: ${url}`);
      
      // باز کردن URL در تب جدید
      window.open(url, '_blank');
      
      setResult('درخواست به صورت مستقیم ارسال شد. لطفاً نتیجه را در تب جدید بررسی کنید.');
    } catch (error) {
      console.error('خطا در ارسال درخواست مستقیم:', error);
      setResult(`خطا: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // تست الگو GET
  const testTemplateGet = async () => {
    setLoading(true);
    setResult('در حال ارسال درخواست الگو...');
    
    try {
      const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${encodeURIComponent(phone)}&template=${encodeURIComponent(template)}&token=${encodeURIComponent(token)}`;
      
      setResult(`درخواست الگو ایجاد شد. URL: ${url}`);
      
      // باز کردن URL در تب جدید
      window.open(url, '_blank');
      
      setResult('درخواست الگو به صورت مستقیم ارسال شد. لطفاً نتیجه را در تب جدید بررسی کنید.');
    } catch (error) {
      console.error('خطا در ارسال درخواست الگو:', error);
      setResult(`خطا: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // تست با img
  const testImgMethod = () => {
    setLoading(true);
    setResult('در حال ارسال با روش تصویر...');
    
    try {
      const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}&sender=${encodeURIComponent(sender)}`;
      
      const img = document.createElement('img');
      img.style.display = 'none';
      img.src = url;
      document.body.appendChild(img);
      
      setResult(`تصویر با URL زیر ایجاد و به DOM اضافه شد:\n${url}`);
      
      setTimeout(() => {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
          setResult(prev => prev + '\nتصویر از DOM حذف شد.');
        }
      }, 5000);
    } catch (error) {
      console.error('خطا در روش تصویر:', error);
      setResult(`خطا: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // تست با iframe
  const testIframeMethod = () => {
    setLoading(true);
    setResult('در حال ارسال با روش iframe...');
    
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      if (!iframe.contentDocument) {
        throw new Error('دسترسی به contentDocument iframe امکان‌پذیر نیست');
      }
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
      form.target = '_blank';
      
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };
      
      addField('receptor', phone);
      addField('message', message);
      addField('sender', sender);
      
      iframe.contentDocument.body.appendChild(form);
      form.submit();
      
      setResult('فرم در iframe ایجاد و ارسال شد. لطفاً نتیجه را در تب جدید (اگر باز شد) بررسی کنید.');
      
      setTimeout(() => {
        document.body.removeChild(iframe);
        setResult(prev => prev + '\niframe از DOM حذف شد.');
      }, 5000);
    } catch (error) {
      console.error('خطا در روش iframe:', error);
      setResult(`خطا: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">تست مستقیم کاوه نگار</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                با استفاده از این صفحه می‌توانید به راحتی وضعیت API کاوه نگار را تست کنید و مشکلات احتمالی را پیدا کنید.
              </p>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>تنظیمات API</CardTitle>
                <CardDescription>تنظیمات مورد نیاز برای اتصال به کاوه نگار</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">کلید API کاوه نگار</Label>
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="کلید API را وارد کنید"
                    className="font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="sender">شماره فرستنده</Label>
                  <Input
                    id="sender"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="مثال: 10008663"
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="sms">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="sms">ارسال پیامک متنی</TabsTrigger>
                <TabsTrigger value="template">ارسال با الگو</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sms">
                <Card>
                  <CardHeader>
                    <CardTitle>ارسال پیامک متنی</CardTitle>
                    <CardDescription>ارسال پیامک متنی با استفاده از API کاوه نگار</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="phone">شماره موبایل گیرنده</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: 09123456789"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">متن پیام</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="متن پیام را وارد کنید"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="flex flex-wrap gap-2 w-full">
                      <Button onClick={testDirectGet} disabled={loading} className="flex-1">
                        تست مستقیم GET
                      </Button>
                      <Button onClick={testImgMethod} disabled={loading} variant="outline" className="flex-1">
                        تست با تصویر
                      </Button>
                      <Button onClick={testIframeMethod} disabled={loading} variant="outline" className="flex-1">
                        تست با iframe
                      </Button>
                    </div>
                    {result && (
                      <div className="w-full bg-gray-50 p-4 rounded border text-sm font-mono overflow-auto whitespace-pre-wrap max-h-60" dir="ltr">
                        {result}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="template">
                <Card>
                  <CardHeader>
                    <CardTitle>ارسال با الگو</CardTitle>
                    <CardDescription>ارسال پیامک با استفاده از الگوهای کاوه نگار</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="phone-template">شماره موبایل گیرنده</Label>
                      <Input
                        id="phone-template"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: 09123456789"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="template">نام الگو</Label>
                      <Input
                        id="template"
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        placeholder="نام الگو"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="token">توکن (برای جایگزینی در الگو)</Label>
                      <Input
                        id="token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="توکن برای جایگزینی در الگو"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button onClick={testTemplateGet} disabled={loading} className="w-full">
                      تست الگو
                    </Button>
                    {result && (
                      <div className="w-full bg-gray-50 p-4 rounded border text-sm font-mono overflow-auto whitespace-pre-wrap max-h-60" dir="ltr">
                        {result}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">نکات مهم</h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>به دلیل محدودیت‌های CORS، ممکن است برخی روش‌ها کار نکنند.</li>
                <li>برای تست باید کلید API و شماره موبایل معتبر وارد کنید.</li>
                <li>اگر از الگو استفاده می‌کنید، الگو باید در پنل کاوه نگار تعریف و تأیید شده باشد.</li>
                <li>برای عیب‌یابی دقیق‌تر، کنسول مرورگر (F12) را بررسی کنید.</li>
                <li>مطمئن شوید که حساب کاوه نگار شما اعتبار کافی دارد.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KavehnegarDemo; 