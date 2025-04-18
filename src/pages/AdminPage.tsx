import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUsers, downloadExcel, UserInfo } from '@/lib/services/userService';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const correctPassword = 'peykhorsid1234'; // رمز عبور ساده برای دسترسی به پنل

  useEffect(() => {
    // بررسی احراز هویت از localStorage
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      // استفاده از تابع async/await داخل useEffect
      const loadUsers = async () => {
        await refreshUsersList();
      };
      loadUsers();
    }
  }, []);

  const refreshUsersList = async () => {
    try {
      const usersList = await getUsers();
      setUsers(usersList);
      console.log('کاربران دریافت شده:', usersList);
    } catch (error) {
      console.error('خطا در دریافت لیست کاربران:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      await refreshUsersList();
    } else {
      alert('رمز عبور اشتباه است!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const handleDownloadExcel = async () => {
    try {
      // ابتدا لیست کاربران را به‌روزرسانی می‌کنیم
      const usersList = await getUsers();
      
      // به روزرسانی لیست کاربران در UI
      setUsers(usersList);
      
      // سپس فایل اکسل را دانلود می‌کنیم
      downloadExcel();
      
      console.log('فایل اکسل با موفقیت دانلود شد');
    } catch (error) {
      console.error('خطا در دانلود فایل اکسل:', error);
      alert('خطا در دانلود فایل اکسل. لطفاً دوباره تلاش کنید.');
    }
  };

  // اضافه کردن دکمه به‌روزرسانی برای بارگذاری مجدد لیست کاربران
  const handleRefresh = async () => {
    await refreshUsersList();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">مدیریت اطلاعات کاربران</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                در این صفحه می‌توانید اطلاعات کاربران ثبت نامی در کوییز سفر را مشاهده و مدیریت کنید.
              </p>
            </div>
            
            {!isAuthenticated ? (
              <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">ورود به پنل مدیریت</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">رمز عبور</label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور را وارد کنید"
                      required
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-peyk-blue hover:bg-peyk-blue-dark">
                    ورود
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">لیست کاربران ({users.length} نفر)</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 ml-2">
                      به‌روزرسانی لیست
                    </Button>
                    <Button onClick={handleDownloadExcel} className="bg-green-600 hover:bg-green-700">
                      دانلود فایل اکسل
                    </Button>
                    <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                      خروج
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-2 border-b text-right">#</th>
                        <th className="py-2 px-2 border-b text-right">نام</th>
                        <th className="py-2 px-2 border-b text-right">شماره موبایل</th>
                        <th className="py-2 px-2 border-b text-right">مقصد سفر</th>
                        <th className="py-2 px-2 border-b text-right">ترجیح سفر</th>
                        <th className="py-2 px-2 border-b text-right">فعالیت‌ها</th>
                        <th className="py-2 px-2 border-b text-right">مدت سفر</th>
                        <th className="py-2 px-2 border-b text-right">فصل</th>
                        <th className="py-2 px-2 border-b text-right">بودجه</th>
                        <th className="py-2 px-2 border-b text-right">ماجراجویی</th>
                        <th className="py-2 px-2 border-b text-right">امتیاز</th>
                        <th className="py-2 px-2 border-b text-right">تاریخ ثبت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-2 border-b">{index + 1}</td>
                            <td className="py-2 px-2 border-b">{user.name || 'بدون نام'}</td>
                            <td className="py-2 px-2 border-b">{user.phone}</td>
                            <td className="py-2 px-2 border-b">{user.travel_destination || user.travelDestination || '-'}</td>
                            <td className="py-2 px-2 border-b">{user.location || (user.quizAnswers?.location) || '-'}</td>
                            <td className="py-2 px-2 border-b">
                              {(() => {
                                // تبدیل مقادیر فعالیت‌ها به فارسی
                                const activities = user.activities || (Array.isArray(user.quizAnswers?.activities) 
                                  ? user.quizAnswers.activities 
                                  : user.quizAnswers?.activities);
                                  
                                if (!activities) return '-';
                                
                                const activitiesMap: Record<string, string> = {
                                  'beach': 'ساحل و دریا',
                                  'hiking': 'طبیعت‌گردی و کوه',
                                  'city': 'گشت‌وگذار شهری',
                                  'cultural': 'جاذبه‌های تاریخی و فرهنگی'
                                };
                                
                                if (Array.isArray(activities)) {
                                  return activities.map(act => activitiesMap[act] || act).join('، ');
                                } else if (typeof activities === 'string') {
                                  // اگر رشته باشد و شامل کاما باشد، آن را تقسیم می‌کنیم
                                  if (activities.includes(',')) {
                                    return activities.split(',').map(act => activitiesMap[act.trim()] || act.trim()).join('، ');
                                  } else {
                                    return activitiesMap[activities] || activities;
                                  }
                                } else {
                                  return '-';
                                }
                              })()}
                            </td>
                            <td className="py-2 px-2 border-b">
                              {(() => {
                                // تبدیل مقادیر مدت سفر به فارسی
                                const duration = user.duration || user.quizAnswers?.duration;
                                
                                if (!duration) return '-';
                                
                                const durationMap: Record<string, string> = {
                                  'short': 'کمتر از ۵ روز',
                                  'medium': '۵ تا ۱۰ روز',
                                  'long': 'بیشتر از ۱۰ روز'
                                };
                                
                                return durationMap[duration] || duration;
                              })()}
                            </td>
                            <td className="py-2 px-2 border-b">
                              {(() => {
                                // تبدیل مقادیر فصل به فارسی
                                const season = user.season || user.quizAnswers?.season;
                                
                                if (!season) return '-';
                                
                                const seasonMap: Record<string, string> = {
                                  'spring': 'بهار',
                                  'summer': 'تابستان',
                                  'fall': 'پاییز',
                                  'winter': 'زمستان'
                                };
                                
                                return seasonMap[season] || season;
                              })()}
                            </td>
                            <td className="py-2 px-2 border-b">{user.budget || user.quizAnswers?.budget || '-'}</td>
                            <td className="py-2 px-2 border-b">{user.adventure || user.quizAnswers?.adventure || '-'}</td>
                            <td className="py-2 px-2 border-b">{user.score || 0}</td>
                            <td className="py-2 px-2 border-b">
                              {user.created_at ? new Date(user.created_at).toLocaleString('fa-IR') : 
                              user.timestamp ? new Date(user.timestamp).toLocaleString('fa-IR') : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="py-4 text-center text-gray-500">
                            هیچ کاربری ثبت نشده است
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage; 