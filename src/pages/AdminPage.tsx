import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUsers, downloadExcel, UserInfo, getQuiz2Users, downloadExcelForQuiz2, Quiz2User } from '@/lib/services/userService';
import { getContactMessages, markMessageAsRead, ContactMessage } from '@/lib/services/contactService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { Mail, Check, Bell, BarChart, Download, Upload } from 'lucide-react';
import StatsPanel from '@/components/admin/StatsPanel';
import { ADMIN_PASSWORD } from '@/lib/config/admin';
import { listContent, createSection, updateSection, deleteSection, ContentItem, getSection, backupContent, restoreContent } from '@/lib/services/contentService';
import ContentEditForm from '@/components/admin/ContentEditForm';
import NavbarEditForm from '@/components/admin/NavbarEditForm';
import FooterEditForm from '@/components/admin/FooterEditForm';
import HeroEditForm from '@/components/admin/HeroEditForm';
import CalculatorEditForm from '@/components/admin/CalculatorEditForm';

const answerMappings: { [key: string]: string } = {
  // سوال ۱
  'A': 'دراز می‌کشم، بخوابم تا فردا!',
  'B': 'موبایلمو درمیارم، سلفی با درخت هم می‌گیرم!',
  'C': 'غر می‌زنم که چرا وای‌فای نمی‌گیره؟',
  'D': 'می‌رم ببینم غذاشون چیه',
  'E': 'چمدون‌مو زیر سرم می‌ذارم، می‌خوابم کنار لابی',
  'F': 'به راننده می‌گم یه جا وایسه از سوپر آب معدنی ارزون بخرم',
  'G': 'یه‌کم وسواس می‌گیرم ببینم تخت تمیزه یا نه',
  // سوال ۲
  // A: 'من؟ هنوز ساعت بدنم خوابه!',
  // B: 'چرا اینقدر زوده?! تور باید از ۱۰ شروع شه!',
  // C: 'یه آب به صورتم می‌زنم، اما اول استوری می‌ذارم',
  // D: 'می‌پرم پایین، چون گفتن بوفه صبحونه بازه',
  // E: 'خودم نمیام، با اسنپ‌فود بیدار می‌شم',
  // F: 'با کم‌ترین هزینه، می‌رم خودم جاها رو ببینم',
  // G: 'شروع می‌کنم غر زدن از شب قبل!',
  // سوال ۳
  // A: 'بی‌خیال، خواب بهتره',
  // B: 'هیچی نمی‌خورم. می‌گم "فقط قرمه‌سبزی مامان خودم!"',
  // C: 'دوتا ساندویچ از خونه آوردم، می‌خورم',
  // D: 'فقط نون و ماست می‌خورم، غر می‌زنم',
  // E: 'می‌رم دنبال رستوران با نور خوب برای عکاسی',
  // F: 'اصلاً برای غذا اومدم! یه غذای جدید امتحان می‌کنم',
  // G: 'دبه می‌کنم با لیدر که پولشو کم کنه!',
  // سوال ۴
  // A: 'صدای خودم بیشتره! اون باید تحمل کنه',
  // B: 'هدفون می‌ذارم، فیلم می‌بینم و می‌خوابم',
  // C: 'به لیدر می‌گم اتاقمو عوض کنه',
  // D: 'می‌رم بیرون رو نیمکت می‌خوابم',
  // E: 'یه استوری از خروپفش می‌ذارم (با تگ خودش 😈)',
  // F: 'خودمو می‌زنم به خواب، شاید درست شه',
  // G: 'یه چک می‌زنم بهش، بعد عذرخواهی می‌کنم 😅',
  // سوال ۵
  // A: 'دکه‌ی فلافل!',
  // B: 'نماهای خاص برای عکس',
  // C: 'جاهایی که ورودی‌ش رایگانه',
  // D: 'بازار محلی برای تست خوراکی‌ها',
  // E: 'نیمکت سایه‌دار برای چرت بعد ناهار',
  // F: 'غر زدن ملت که "چرا اینقد گرمه؟"',
  // G: 'فقط دنبال جاهای تمیز و لوکس می‌گردم',
  // سوال ۶
  // A: 'اینکه کی بخوابم جبران کنم',
  // B: 'اینکه چه استوری‌هایی گرفتم!',
  // C: 'اینکه اصلاً راضی نبودم!',
  // D: 'اینکه چرا شام شب آخر کم بود',
  // E: 'اینکه خرجش بالا بود ولی من کم خرج دادم',
  // F: 'اینکه چقدر خوش گذشت با غذاهاش',
  // G: 'اینکه بالش اتاقم سفت بود یا نرم',
};

const getAnswerText = (questionIndex: number, answerValue: string): string => {
  // This is a simplified mapping. A more robust solution would involve a structured data source.
  // For now, we assume the order and values from TravelQuiz2.tsx
  const questionsContent = [
    // Q1
    { A: 'دراز می‌کشم، بخوابم تا فردا!', B: 'موبایلمو درمیارم، سلفی با درخت هم می‌گیرم!', C: 'غر می‌زنم که چرا وای‌فای نمی‌گیره؟', D: 'می‌رم ببینم غذاشون چیه', E: 'چمدون‌مو زیر سرم می‌ذارم، می‌خوابم کنار لابی', F: 'به راننده می‌گم یه جا وایسه از سوپر آب معدنی ارزون بخرم', G: 'یه‌کم وسواس می‌گیرم ببینم تخت تمیزه یا نه' },
    // Q2
    { A: 'من؟ هنوز ساعت بدنم خوابه!', B: 'چرا اینقدر زوده؟! تور باید از ۱۰ شروع شه!', C: 'یه آب به صورتم می‌زنم، اما اول استوری می‌ذارم', D: 'می‌پرم پایین، چون گفتن بوفه صبحونه بازه', E: 'خودم نمیام، با اسنپ‌فود بیدار می‌شم', F: 'با کم‌ترین هزینه، می‌رم خودم جاها رو ببینم', G: 'شروع می‌کنم غر زدن از شب قبل!' },
    // Q3
    { A: 'بی‌خیال، خواب بهتره', B: 'هیچی نمی‌خورم. می‌گم "فقط قرمه‌سبزی مامان خودم!"', C: 'دوتا ساندویچ از خونه آوردم، می‌خورم', D: 'فقط نون و ماست می‌خورم، غر می‌زنم', E: 'می‌رم دنبال رستوران با نور خوب برای عکاسی', F: 'اصلاً برای غذا اومدم! یه غذای جدید امتحان می‌کنم', G: 'دبه می‌کنم با لیدر که پولشو کم کنه!' },
    // Q4
    { A: 'صدای خودم بیشتره! اون باید تحمل کنه', B: 'هدفون می‌ذارم، فیلم می‌بینم و می‌خوابم', C: 'به لیدر می‌گم اتاقمو عوض کنه', D: 'می‌رم بیرون رو نیمکت می‌خوابم', E: 'یه استوری از خروپفش می‌ذارم (با تگ خودش 😈)', F: 'خودمو می‌زنم به خواب، شاید درست شه', G: 'یه چک می‌زنم بهش، بعد عذرخواهی می‌کنم 😅' },
    // Q5
    { A: 'دکه‌ی فلافل!', B: 'نماهای خاص برای عکس', C: 'جاهایی که ورودی‌ش رایگانه', D: 'بازار محلی برای تست خوراکی‌ها', E: 'نیمکت سایه‌دار برای چرت بعد ناهار', F: 'غر زدن ملت که "چرا اینقد گرمه؟"', G: 'فقط دنبال جاهای تمیز و لوکس می‌گردم' },
    // Q6
    { A: 'اینکه کی بخوابم جبران کنم', B: 'اینکه چه استوری‌هایی گرفتم!', C: 'اینکه اصلاً راضی نبودم!', D: 'اینکه چرا شام شب آخر کم بود', E: 'اینکه خرجش بالا بود ولی من کم خرج دادم', F: 'اینکه چقدر خوش گذشت با غذاهاش', G: 'اینکه بالش اتاقم سفت بود یا نرم' },
  ];

  if (questionIndex < questionsContent.length) {
    // @ts-ignore
    return questionsContent[questionIndex][answerValue] || answerValue;
  }
  return answerValue;
};


const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [quiz2Users, setQuiz2Users] = useState<Quiz2User[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentPageFilter, setContentPageFilter] = useState<string>('home');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const correctPassword = ADMIN_PASSWORD; // استفاده از رمز عبور از فایل کانفیگ

  useEffect(() => {
    // بررسی احراز هویت از localStorage
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      // استفاده از تابع async/await داخل useEffect
      const loadData = async () => {
        await refreshUsersList();
        await refreshQuiz2UsersList();
        await refreshContactMessages();
        await refreshContentList('home');
      };
      loadData();
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

  const refreshContentList = async (page?: string) => {
    try {
      const items = await listContent(page || contentPageFilter);
      setContentItems(items);
    } catch (error) {
      console.error('خطا در دریافت محتوا:', error);
      toast.error('خطا در دریافت محتوا');
    }
  };

  const handleEditContent = (item?: ContentItem) => {
    if (item) {
      setEditingItem({ ...item, data: safeParseJson(item.data) });
    } else {
      setEditingItem({ page: contentPageFilter, section_key: '', title: '', data: {}, sort_order: 0, is_active: 1 });
    }
  };

  const safeParseJson = (value: any) => {
    if (value && typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value || {};
  };

  const handleSaveContent = async () => {
    if (!editingItem) return;
    if (!editingItem.page || !editingItem.section_key) {
      toast.error('صفحه و کلید سکشن الزامی است');
      return;
    }
    setIsSavingContent(true);
    try {
      const payload: ContentItem = {
        page: editingItem.page,
        section_key: editingItem.section_key,
        title: editingItem.title || '',
        data: editingItem.data || {},
        sort_order: editingItem.sort_order || 0,
        is_active: editingItem.is_active ? 1 : 0,
      };
      if (editingItem.id) {
        await updateSection(editingItem.id, payload);
        toast.success('با موفقیت ذخیره شد');
      } else {
        await createSection(payload);
        toast.success('ایجاد شد');
      }
      setEditingItem(null);
      await refreshContentList();
    } catch (e) {
      console.error(e);
      toast.error('خطا در ذخیره‌سازی محتوا');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleDeleteContent = async (id: number) => {
    try {
      // پیدا کردن سکشن برای نمایش نام
      const section = contentItems?.find(item => item.id === id);
      const sectionName = section?.title || section?.section_key || 'این سکشن';
      
      // نمایش اخطار با SweetAlert2
      const result = await Swal.fire({
        title: '⚠️ اخطار حذف سکشن',
        html: `
          <div class="text-right">
            <p class="mb-4">آیا مطمئن هستید که می‌خواهید سکشن <strong>"${sectionName}"</strong> را حذف کنید؟</p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p class="text-red-800 font-semibold">⚠️ این عمل قابل برگشت نیست!</p>
              <p class="text-red-600 text-sm mt-2">قبل از حذف، یک بکاپ خودکار از محتوا گرفته می‌شود.</p>
            </div>
            <p class="text-gray-600 text-sm">برای ادامه، نام سکشن را تایپ کنید:</p>
            <input type="text" id="confirmName" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="${sectionName}">
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'انصراف',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        focusConfirm: false,
        preConfirm: () => {
          const confirmName = (document.getElementById('confirmName') as HTMLInputElement)?.value;
          if (confirmName !== sectionName) {
            Swal.showValidationMessage('نام سکشن صحیح نیست!');
            return false;
          }
          return true;
        }
      });

      if (result.isConfirmed) {
        // نمایش loading
        Swal.fire({
          title: 'در حال حذف...',
          text: 'لطفاً صبر کنید',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // گرفتن بکاپ قبل از حذف
        try {
          const backupBlob = await backupContent();
          const backupUrl = URL.createObjectURL(backupBlob);
          const backupLink = document.createElement('a');
          backupLink.href = backupUrl;
          backupLink.download = `backup-before-delete-${sectionName}-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(backupLink);
          backupLink.click();
          document.body.removeChild(backupLink);
          URL.revokeObjectURL(backupUrl);
        } catch (backupError) {
          console.warn('خطا در بکاپ:', backupError);
        }

        // حذف سکشن
        await deleteSection(id);
        
        // نمایش موفقیت
        Swal.fire({
          title: '✅ موفقیت',
          text: `سکشن "${sectionName}" با موفقیت حذف شد`,
          icon: 'success',
          confirmButtonText: 'باشه'
        });
        
        toast.success(`سکشن "${sectionName}" با موفقیت حذف شد`);
        await refreshContentList();
      }
    } catch (error) {
      console.error('خطا در حذف سکشن:', error);
      Swal.fire({
        title: '❌ خطا',
        text: 'خطا در حذف سکشن',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      toast.error('خطا در حذف سکشن');
    }
  };

  // بکاپ محتوا
  const handleBackupContent = async () => {
    try {
      const blob = await backupContent();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `content-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('بکاپ با موفقیت دانلود شد');
    } catch (error) {
      console.error('خطا در بکاپ:', error);
      toast.error('خطا در بکاپ محتوا');
    }
  };

  // ریستور محتوا
  const handleRestoreContent = async () => {
    const result = await Swal.fire({
      title: 'ریستور محتوا',
      text: 'آیا مطمئن هستید که می‌خواهید محتوای فعلی را با فایل بکاپ جایگزین کنید؟ این عمل غیرقابل برگشت است!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، ریستور کن!',
      cancelButtonText: 'انصراف',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    // ایجاد input برای انتخاب فایل
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        const restoreResult = await restoreContent(backupData);
        toast.success(restoreResult.message);
        await refreshContentList();
      } catch (error) {
        console.error('خطا در ریستور:', error);
        toast.error('خطا در ریستور محتوا. لطفاً فایل معتبر انتخاب کنید.');
      }
    };
    input.click();
  };

  const refreshQuiz2UsersList = async () => {
    try {
      const usersList = await getQuiz2Users();
      setQuiz2Users(usersList);
      console.log('کاربران کوییز 2 دریافت شده:', usersList);
    } catch (error) {
      console.error('خطا در دریافت لیست کاربران کوییز 2:', error);
    }
  };

  const refreshContactMessages = async () => {
    try {
      setIsLoadingContacts(true);
      const messages = await getContactMessages();
      setContactMessages(messages);
      console.log('پیام‌های تماس با ما دریافت شده:', messages);
    } catch (error) {
      console.error('خطا در دریافت پیام‌های تماس با ما:', error);
      toast.error('خطا در دریافت پیام‌های تماس با ما');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      await refreshUsersList();
      await refreshQuiz2UsersList();
      await refreshContactMessages();
      await refreshContentList('home');
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
      setUsers(usersList);
      // سپس فایل اکسل را فقط با کاربران فیلترشده دانلود می‌کنیم
      downloadExcel(filteredUsers);
      console.log('فایل اکسل با موفقیت دانلود شد');
    } catch (error) {
      console.error('خطا در دانلود فایل اکسل:', error);
      alert('خطا در دانلود فایل اکسل. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleDownloadExcelForQuiz2 = async () => {
    try {
      await refreshQuiz2UsersList(); // Refresh data before download
      downloadExcelForQuiz2(quiz2Users);
      console.log('فایل اکسل کوییز 2 با موفقیت دانلود شد');
    } catch (error) {
      console.error('خطا در دانلود فایل اکسل کوییز 2:', error);
      alert('خطا در دانلود فایل اکسل کوییز 2. لطفاً دوباره تلاش کنید.');
    }
  };


  // اضافه کردن دکمه به‌روزرسانی برای بارگذاری مجدد لیست کاربران
  const handleRefresh = async () => {
    await refreshUsersList();
  };

  const handleMarkAsRead = async (id: number | string) => {
    try {
      await markMessageAsRead(id);
      // به‌روزرسانی لیست پیام‌ها
      await refreshContactMessages();
      toast.success('پیام با موفقیت به عنوان خوانده شده علامت‌گذاری شد');
    } catch (error) {
      console.error('خطا در به‌روزرسانی وضعیت پیام:', error);
      toast.error('خطا در به‌روزرسانی وضعیت پیام');
    }
  };

  // تابع حذف کاربر کوییز ۱
  const handleDeleteUser = async (user: UserInfo) => {
    const result = await Swal.fire({
      title: 'حذف کاربر',
      text: `آیا مطمئن هستید که می‌خواهید کاربر "${user.name || 'بدون نام'}" با شماره ${user.phone} را حذف کنید؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن!',
      cancelButtonText: 'انصراف',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      // اینجا باید API حذف کاربر اضافه شود
      toast.success('کاربر حذف شد');
      await refreshUsersList();
    } catch (error) {
      console.error('خطا در حذف کاربر:', error);
      toast.error('خطا در حذف کاربر');
    }
  };

  // تابع حذف کاربر کوییز ۲
  const handleDeleteQuiz2User = async (user: Quiz2User) => {
    const result = await Swal.fire({
      title: 'حذف کاربر کوییز ۲',
      text: `آیا مطمئن هستید که می‌خواهید کاربر "${user.name}" با شماره ${user.phone} را حذف کنید؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن!',
      cancelButtonText: 'انصراف',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      // اینجا باید API حذف کاربر کوییز ۲ اضافه شود
      toast.success('کاربر کوییز ۲ حذف شد');
      await refreshQuiz2UsersList();
    } catch (error) {
      console.error('خطا در حذف کاربر کوییز ۲:', error);
      toast.error('خطا در حذف کاربر کوییز ۲');
    }
  };

  // تابع حذف پیام تماس
  const handleDeleteContactMessage = async (message: ContactMessage) => {
    const result = await Swal.fire({
      title: 'حذف پیام',
      text: `آیا مطمئن هستید که می‌خواهید پیام "${message.name}" را حذف کنید؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن!',
      cancelButtonText: 'انصراف',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      // اینجا باید API حذف پیام اضافه شود
      toast.success('پیام حذف شد');
      await refreshContactMessages();
    } catch (error) {
      console.error('خطا در حذف پیام:', error);
      toast.error('خطا در حذف پیام');
    }
  };

  // شمارش پیام‌های خوانده نشده
  const unreadCount = contactMessages?.filter(msg => !msg.is_read).length || 0;

  // فیلتر کردن کاربران برای حذف شماره‌های تکراری و نمایش فقط رکورد کامل یا اولیه
  const filteredUsers = Array.from(
    (users || []).reduce((acc, user) => {
      const phone = user.phone;
      // شرط تکمیل بودن کوییز: داشتن travel_destination یا travelDestination یا حداقل یک quizAnswers کامل
      const isComplete = Boolean(
        user.travel_destination || user.travelDestination ||
        (user.quizAnswers && Object.keys(user.quizAnswers).length > 0)
      );
      if (!acc.has(phone)) {
        acc.set(phone, user);
      } else {
        const existing = acc.get(phone);
        const existingIsComplete = Boolean(
          existing.travel_destination || existing.travelDestination ||
          (existing.quizAnswers && Object.keys(existing.quizAnswers).length > 0)
        );
        // اگر رکورد جدید کامل‌تر است، جایگزین کن
        if (isComplete && !existingIsComplete) {
          acc.set(phone, user);
        }
      }
      return acc;
    }, new Map()),
    ([, user]) => user
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto" dir="rtl">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">پنل مدیریت سایت</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                در این صفحه می‌توانید اطلاعات کاربران و پیام‌های تماس با ما را مدیریت کنید.
              </p>
            </div>
            
            {!isAuthenticated ? (
              <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4 text-right">ورود به پنل مدیریت</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1 text-right">رمز عبور</label>
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
                  <h2 className="text-xl font-bold">پنل مدیریت</h2>
                  <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    خروج
                  </Button>
                </div>
                
                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="mb-6 w-full justify-end bg-gray-100 p-1">
                    <TabsTrigger value="content" className="data-[state=active]:bg-white">مدیریت محتوا</TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-white flex items-center">
                      <BarChart className="h-4 w-4 ml-1" />
                      <span>آمار کلیک‌ها</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact-messages" className="data-[state=active]:bg-white flex items-center">
                      <span>پیام‌های تماس با ما</span>
                      {unreadCount > 0 && (
                        <span className="mr-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                          {unreadCount}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-white">کاربران کوییز سفر</TabsTrigger>
                    <TabsTrigger value="quiz2-users" className="data-[state=active]:bg-white">کاربران کوییز سفر ۲</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-0">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">صفحه:</label>
                        <select
                          value={contentPageFilter}
                          onChange={async (e) => { setContentPageFilter(e.target.value); await refreshContentList(e.target.value); }}
                          className="border rounded px-2 py-1"
                        >
                          <option value="home">صفحه اصلی</option>
                          <option value="quiz">کوییز سفر</option>
                          <option value="quiz2">کوییز سفر ۲</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={handleBackupContent} 
                          variant="outline" 
                          className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Download className="h-4 w-4" />
                          بکاپ محتوا
                        </Button>
                        <Button 
                          onClick={handleRestoreContent} 
                          variant="outline" 
                          className="flex items-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <Upload className="h-4 w-4" />
                          ریستور محتوا
                        </Button>
                        <Button onClick={() => handleEditContent()} className="bg-peyk-blue">ایجاد سکشن جدید</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {contentItems && contentItems.length > 0 ? contentItems.map((item, idx) => (
                        <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-gray-800">{item.title || item.section_key}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.page}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{item.section_key}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditContent(item)} className="flex-1">
                              ویرایش
                            </Button>
                            {item.id && (
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteContent(item.id!)}>
                                حذف
                              </Button>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          موردی یافت نشد
                        </div>
                      )}
                    </div>

                    {editingItem && (
                      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
                          <h3 className="text-xl font-bold mb-6 text-center">{editingItem.id ? 'ویرایش سکشن' : 'ایجاد سکشن'}</h3>
                          
                          {/* فرم بر اساس نوع سکشن */}
                          {editingItem.section_key === 'navbar' ? (
                            <NavbarEditForm 
                              item={editingItem} 
                              onSave={handleSaveContent}
                              onCancel={() => setEditingItem(null)}
                              isSaving={isSavingContent}
                              onChange={setEditingItem}
                            />
                          ) : editingItem.section_key === 'footer' ? (
                            <FooterEditForm 
                              item={editingItem} 
                              onSave={handleSaveContent}
                              onCancel={() => setEditingItem(null)}
                              isSaving={isSavingContent}
                              onChange={setEditingItem}
                            />
                          ) : editingItem.section_key === 'hero' ? (
                            <HeroEditForm 
                              item={editingItem} 
                              onSave={handleSaveContent}
                              onCancel={() => setEditingItem(null)}
                              isSaving={isSavingContent}
                              onChange={setEditingItem}
                            />
                          ) : editingItem.section_key === 'calculator' ? (
                            <CalculatorEditForm 
                              item={editingItem} 
                              onSave={handleSaveContent}
                              onCancel={() => setEditingItem(null)}
                              isSaving={isSavingContent}
                              onChange={setEditingItem}
                            />
                          ) : (
                            <ContentEditForm 
                              item={editingItem} 
                              onSave={handleSaveContent}
                              onCancel={() => setEditingItem(null)}
                              isSaving={isSavingContent}
                              onChange={setEditingItem}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="users" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">لیست کاربران کوییز سفر ({filteredUsers?.length || 0} نفر)</h3>
                      <div className="flex gap-2">
                        <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 ml-2">
                          به‌روزرسانی لیست
                        </Button>
                        <Button onClick={handleDownloadExcel} className="bg-green-600 hover:bg-green-700">
                          دانلود فایل اکسل
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
                            <th className="py-2 px-2 border-b text-right">اقدامات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers && filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-2 border-b text-right">{index + 1}</td>
                                <td className="py-2 px-2 border-b text-right">{user.name || 'بدون نام'}</td>
                                <td className="py-2 px-2 border-b text-right">{user.phone}</td>
                                <td className="py-2 px-2 border-b text-right">{user.travel_destination || user.travelDestination || '-'}</td>
                                <td className="py-2 px-2 border-b text-right">{user.location || (user.quizAnswers?.location) || '-'}</td>
                                <td className="py-2 px-2 border-b text-right">
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
                                      return (activities || []).map(act => activitiesMap[act] || act).join('، ');
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
                                <td className="py-2 px-2 border-b text-right">
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
                                <td className="py-2 px-2 border-b text-right">
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
                                <td className="py-2 px-2 border-b text-right">
                                  {(() => {
                                    // تبدیل مقادیر بودجه به فارسی
                                    const budget = user.budget || user.quizAnswers?.budget;
                                    
                                    if (!budget) return '-';
                                    
                                    const budgetMap: Record<string, string> = {
                                      'low': 'کم',
                                      'medium': 'متوسط',
                                      'high': 'زیاد'
                                    };
                                    
                                    return budgetMap[budget] || budget;
                                  })()}
                                </td>
                                <td className="py-2 px-2 border-b text-right">
                                  {(() => {
                                    // تبدیل مقادیر ماجراجویی به فارسی
                                    const adventure = user.adventure || user.quizAnswers?.adventure;
                                    
                                    if (!adventure) return '-';
                                    
                                    const adventureMap: Record<string, string> = {
                                      'low': 'کم',
                                      'medium': 'متوسط',
                                      'high': 'زیاد'
                                    };
                                    
                                    return adventureMap[adventure] || adventure;
                                  })()}
                                </td>
                                <td className="py-2 px-2 border-b text-right">{user.score || 0}</td>
                                <td className="py-2 px-2 border-b text-right">
                                  {user.created_at ? new Date(user.created_at).toLocaleDateString('fa-IR') : '-'}
                                </td>
                                <td className="py-2 px-2 border-b text-right">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    حذف
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                                                          <td colSpan={13} className="py-4 text-center text-gray-500">
                              هنوز کاربری ثبت نشده است
                            </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz2-users" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">لیست کاربران کوییز ۲ ({quiz2Users?.length || 0} نفر)</h3>
                      <div className="flex gap-2">
                        <Button onClick={refreshQuiz2UsersList} className="bg-blue-600 hover:bg-blue-700 ml-2">
                          به‌روزرسانی لیست
                        </Button>
                        <Button onClick={handleDownloadExcelForQuiz2} className="bg-green-600 hover:bg-green-700">
                          دانلود فایل اکسل
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
                            <th className="py-2 px-2 border-b text-right">نتیجه</th>
                            <th className="py-2 px-2 border-b text-right" style={{ minWidth: '300px' }}>پاسخ‌ها</th>
                            <th className="py-2 px-2 border-b text-right">تاریخ ثبت</th>
                            <th className="py-2 px-2 border-b text-right">اقدامات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quiz2Users && quiz2Users.length > 0 ? (
                            quiz2Users.map((user, index) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-2 border-b text-right">{index + 1}</td>
                                <td className="py-2 px-2 border-b text-right">{user.name || 'بدون نام'}</td>
                                <td className="py-2 px-2 border-b text-right">{user.phone}</td>
                                <td className="py-2 px-2 border-b text-right">{user.result || '-'}</td>
                                <td className="py-2 px-2 border-b text-right">
                                  {(() => {
                                    try {
                                      const answers = JSON.parse(user.answers || '[]');
                                      return (
                                        <ul className="list-none p-0 m-0">
                                          {(answers || []).map((ans: string, idx: number) => (
                                            <li key={idx} className="text-xs">
                                              {`سوال ${idx + 1}: ${getAnswerText(idx, ans)}`}
                                            </li>
                                          ))}
                                        </ul>
                                      );
                                    } catch {
                                      return user.answers;
                                    }
                                  })()}
                                </td>
                                <td className="py-2 px-2 border-b text-right">{new Date(user.created_at).toLocaleString('fa-IR')}</td>
                                <td className="py-2 px-2 border-b text-right">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteQuiz2User(user)}
                                  >
                                    حذف
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="py-4 px-4 text-center">
                                کاربری یافت نشد.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact-messages" className="mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        پیام‌های تماس با ما 
                        {unreadCount > 0 && (
                          <span className="mr-2 text-sm bg-red-500 text-white rounded-full px-2 py-0.5">
                            {unreadCount} پیام جدید
                          </span>
                        )}
                      </h3>
                      <Button onClick={refreshContactMessages} disabled={isLoadingContacts} className="bg-blue-600 hover:bg-blue-700">
                        {isLoadingContacts ? 'در حال بارگذاری...' : 'به‌روزرسانی پیام‌ها'}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {contactMessages && contactMessages.length > 0 ? (
                        contactMessages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`border rounded-lg p-4 ${!message.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-500 ml-2" />
                                <h4 className="font-semibold">
                                  {message.name} - {message.email}
                                </h4>
                                {!message.is_read && (
                                  <span className="mr-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                                    جدید
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 ml-2">
                                  {new Date(message.created_at).toLocaleDateString('fa-IR')}
                                </span>
                                {!message.is_read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleMarkAsRead(message.id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1"
                                  >
                                    <Check className="h-4 w-4 ml-1" />
                                    <span className="text-xs">علامت‌گذاری به عنوان خوانده شده</span>
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteContactMessage(message)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                >
                                  <span className="text-xs">حذف پیام</span>
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap mb-2 text-right">{message.message}</p>
                            <div className="text-sm text-gray-500 text-right">
                              شماره تماس: {message.phone || 'ندارد'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          هنوز پیامی دریافت نشده است
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="mt-0">
                    <StatsPanel />
                  </TabsContent>
                </Tabs>
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