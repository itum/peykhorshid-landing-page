import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { getDailyStats, getTotalStatsByType, getAllStats, getTopItems, DailyStats, TypeStats, AllStats, TopItem } from '@/lib/services/statsService';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { toast } from 'sonner';

// کامپوننت نمایش آمار کلیک‌ها
const StatsPanel = () => {
  // state ها برای ذخیره آمار مختلف
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [supportStats, setSupportStats] = useState<TypeStats[]>([]);
  const [tourStats, setTourStats] = useState<TypeStats[]>([]);
  const [allStats, setAllStats] = useState<AllStats[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // دریافت همه آمارها
  const fetchAllStats = async () => {
    setIsLoading(true);
    try {
      // دریافت آمار کلی
      const overallStats = await getAllStats();
      setAllStats(overallStats);

      // دریافت آمار روزانه (30 روز اخیر)
      const dailyData = await getDailyStats('all', 30);
      setDailyStats(dailyData);

      // دریافت آمار کلیک روی شماره‌های پشتیبانی
      const supportData = await getTotalStatsByType('support');
      setSupportStats(supportData);

      // دریافت آمار کلیک روی تورها
      const tourData = await getTotalStatsByType('tour');
      setTourStats(tourData);

      // دریافت پربازدیدترین آیتم‌ها
      const topItemsData = await getTopItems(10);
      setTopItems(topItemsData);

      toast.success('آمارها با موفقیت به‌روزرسانی شدند');
    } catch (error) {
      console.error('خطا در دریافت آمارها:', error);
      toast.error('خطا در دریافت آمارها');
    } finally {
      setIsLoading(false);
    }
  };

  // دریافت آمارها در زمان بارگذاری کامپوننت
  useEffect(() => {
    fetchAllStats();
  }, []);

  // تغییر تب فعال
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // فرمت کردن تاریخ برای نمایش
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  return (
    <div dir="rtl" className="stats-panel space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">آمار کلیک‌ها</h3>
        <Button 
          onClick={fetchAllStats} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? 'در حال بارگذاری...' : 'به‌روزرسانی آمار'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 w-full justify-end bg-gray-100 p-1">
          <TabsTrigger 
            value="tours" 
            className="data-[state=active]:bg-white flex items-center gap-1">
            <PieChart className="h-4 w-4 ml-1" />
            <span>تورها</span>
          </TabsTrigger>
          <TabsTrigger 
            value="support" 
            className="data-[state=active]:bg-white flex items-center gap-1">
            <PieChart className="h-4 w-4 ml-1" />
            <span>شماره‌های پشتیبانی</span>
          </TabsTrigger>
          <TabsTrigger 
            value="daily" 
            className="data-[state=active]:bg-white flex items-center gap-1">
            <LineChart className="h-4 w-4 ml-1" />
            <span>آمار روزانه</span>
          </TabsTrigger>
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white flex items-center gap-1">
            <BarChart className="h-4 w-4 ml-1" />
            <span>نمای کلی</span>
          </TabsTrigger>
        </TabsList>

        {/* نمای کلی */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2 text-right">
                  <CardTitle className="text-sm font-medium">
                    {stat.item_type === 'support' ? 'شماره‌های پشتیبانی' : 
                     stat.item_type === 'tour' ? 'تورها' : 
                     stat.item_type === 'domestic' ? 'تورهای داخلی' : 
                     stat.item_type === 'special' ? 'تورهای ویژه' : 
                     stat.item_type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="text-2xl font-bold">{stat.total_clicks.toLocaleString('fa-IR')}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    تعداد کل کلیک‌های ثبت شده
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-base font-semibold mb-3 text-right">پربازدیدترین آیتم‌ها</h4>
            <div className="bg-white rounded-md border overflow-hidden">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-right font-medium">نوع</th>
                    <th className="py-2 px-4 text-right font-medium">نام</th>
                    <th className="py-2 px-4 text-right font-medium">تعداد کلیک</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-right">
                        {item.item_type === 'support' ? 'شماره پشتیبانی' : 
                         item.item_type === 'tour' ? 'تور' : 
                         item.item_type === 'domestic' ? 'تور داخلی' : 
                         item.item_type === 'special' ? 'تور ویژه' : 
                         item.item_type}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.item_name || item.item_id}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.total_clicks.toLocaleString('fa-IR')}
                      </td>
                    </tr>
                  ))}
                  {topItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
                        هنوز آماری ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* آمار روزانه */}
        <TabsContent value="daily" className="mt-0">
          <div className="bg-white rounded-md border p-4">
            <h4 className="text-base font-semibold mb-3 text-right">آمار کلیک روزانه (30 روز اخیر)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-right font-medium">تاریخ</th>
                    <th className="py-2 px-4 text-right font-medium">تعداد کلیک</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((day, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-right">{formatDate(day.click_date)}</td>
                      <td className="py-3 px-4 text-right">{day.total_clicks.toLocaleString('fa-IR')}</td>
                    </tr>
                  ))}
                  {dailyStats.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-500">
                        هنوز آماری ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* آمار شماره‌های پشتیبانی */}
        <TabsContent value="support" className="mt-0">
          <div className="bg-white rounded-md border p-4">
            <h4 className="text-base font-semibold mb-3 text-right">آمار کلیک روی شماره‌های پشتیبانی</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-right font-medium">شماره / نام</th>
                    <th className="py-2 px-4 text-right font-medium">تعداد کلیک</th>
                  </tr>
                </thead>
                <tbody>
                  {supportStats.length > 0 ? (
                    supportStats.map((support, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-right">{support.item_name || support.item_id}</td>
                        <td className="py-3 px-4 text-right">{support.total_clicks.toLocaleString('fa-IR')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-500">
                        هنوز آماری برای شماره‌های پشتیبانی ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* آمار تورها */}
        <TabsContent value="tours" className="mt-0">
          <div className="bg-white rounded-md border p-4">
            <h4 className="text-base font-semibold mb-3 text-right">آمار کلیک روی تورها</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-right font-medium">نام تور</th>
                    <th className="py-2 px-4 text-right font-medium">تعداد کلیک</th>
                  </tr>
                </thead>
                <tbody>
                  {tourStats.length > 0 ? (
                    tourStats.map((tour, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-right">{tour.item_name || tour.item_id}</td>
                        <td className="py-3 px-4 text-right">{tour.total_clicks.toLocaleString('fa-IR')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-gray-500">
                        هنوز آماری برای تورها ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPanel; 