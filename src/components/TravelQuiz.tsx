import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Plane, Map, Palmtree, Mountain, Car, Train, Anchor, Phone, User, Lock, Search, X } from 'lucide-react';
import { addUser, sendSMS, sendSMSAlternative, UserInfo } from '@/lib/services/userService';
import { sendSMSWithJSONP, sendSMSWithIframe } from '@/lib/services/smsUtils';
import React from 'react';

type QuizOption = {
  id: string;
  text: string;
  icon: React.ReactNode;
  value: string | number;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  multiple?: boolean;
};

const TravelQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [travelDestination, setTravelDestination] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [destination, setDestination] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDestinations, setShowDestinations] = useState(false);
  const [selectedDestinationType, setSelectedDestinationType] = useState<'domestic' | 'international'>('domestic');
  const destinationsRef = useRef<HTMLDivElement>(null);

  // جشن برای نمایش در پایان آزمون
  const triggerConfetti = () => {
    // ساده‌سازی شده، فقط نوار پیشرفت را تکمیل می‌کنیم
    // در نسخه واقعی می‌توان از کتابخانه canvas-confetti استفاده کرد
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.classList.add('complete');
    }
  };

  // تبدیل اعداد فارسی/عربی به انگلیسی
  const convertPersianToEnglish = (text: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = text;
    
    // تبدیل اعداد فارسی به انگلیسی
    for (let i = 0; i < 10; i++) {
      const persianRegex = new RegExp(persianNumbers[i], 'g');
      result = result.replace(persianRegex, englishNumbers[i]);
      
      const arabicRegex = new RegExp(arabicNumbers[i], 'g');
      result = result.replace(arabicRegex, englishNumbers[i]);
    }
    
    return result;
  };

  // بررسی معتبر بودن شماره موبایل
  const validatePhone = (value: string): boolean => {
    // تبدیل اعداد فارسی/عربی به انگلیسی
    const englishValue = convertPersianToEnglish(value);
    
    // حذف فاصله‌ها، خط تیره و پرانتز
    const cleanedValue = englishValue.replace(/[\s\-()]/g, '');
    
    // بررسی شماره موبایل ایرانی (شروع با 09 و دقیقاً 11 رقم)
    const regex = /^09[0-9]{9}$/;
    return regex.test(cleanedValue);
  };

  // به‌روزرسانی شماره موبایل
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // تنظیم مقدار اصلی (با حفظ اعداد فارسی یا عربی برای نمایش)
    setPhone(value);
    
    // اعتبارسنجی پس از تبدیل به اعداد انگلیسی
    setIsPhoneValid(validatePhone(value));
  };

  // تولید سوالات مرتبط با مقصد
  const generateDestinationQuestions = (destName: string): QuizQuestion[] => {
    // بررسی نوع مقصد (داخلی یا خارجی)
    const isInternational = destinations.international.some(dest => dest.name === destName);
    const destinationType = isInternational ? 'international' : 'domestic';
    
    // سوالات مشترک برای همه مقصدها
    const commonQuestions: QuizQuestion[] = [
      {
        id: 'travel_time',
        question: `چه زمانی قصد سفر به ${destName} را دارید؟`,
        options: [
          { id: 'soon', text: 'یک ماه آینده', icon: <span className="text-sm">1️⃣</span>, value: 'یک ماه آینده' },
          { id: 'medium', text: 'سه ماه آینده', icon: <span className="text-sm">3️⃣</span>, value: 'سه ماه آینده' },
          { id: 'later', text: 'شش ماه آینده', icon: <span className="text-sm">6️⃣</span>, value: 'شش ماه آینده' },
          { id: 'planning', text: 'فقط در حال برنامه‌ریزی هستم', icon: <span className="text-sm">🗓️</span>, value: 'در حال برنامه‌ریزی' }
        ]
      },
      {
        id: 'travel_companions',
        question: `چه کسانی همراه شما به ${destName} سفر خواهند کرد؟`,
        options: [
          { id: 'alone', text: 'به تنهایی', icon: <span className="text-sm">👤</span>, value: 'تنها' },
          { id: 'couple', text: 'همسر/نامزد', icon: <span className="text-sm">💑</span>, value: 'با همسر/نامزد' },
          { id: 'family', text: 'خانواده', icon: <span className="text-sm">👨‍👩‍👧‍👦</span>, value: 'با خانواده' },
          { id: 'friends', text: 'دوستان', icon: <span className="text-sm">👥</span>, value: 'با دوستان' }
        ]
      },
      {
        id: 'budget_range',
        question: `بودجه شما برای سفر به ${destName} چقدر است؟`,
        options: [
          { id: 'economic', text: 'اقتصادی', icon: <span className="text-sm">💰</span>, value: 'اقتصادی' },
          { id: 'standard', text: 'استاندارد', icon: <span className="text-sm">💰💰</span>, value: 'استاندارد' },
          { id: 'luxury', text: 'لوکس', icon: <span className="text-sm">💰💰💰</span>, value: 'لوکس' },
          { id: 'vip', text: 'بسیار لوکس (VIP)', icon: <span className="text-sm">👑</span>, value: 'VIP' }
        ]
      }
    ];
    
    // سوالات ویژه مقصدهای داخلی
    const domesticQuestions: QuizQuestion[] = [
      {
        id: 'travel_transport',
        question: `نحوه سفر به ${destName} را چگونه ترجیح می‌دهید؟`,
        options: [
          { id: 'plane', text: 'هواپیما', icon: <Plane className="h-5 w-5" />, value: 'هواپیما' },
          { id: 'car', text: 'خودرو شخصی', icon: <Car className="h-5 w-5" />, value: 'خودرو شخصی' },
          { id: 'train', text: 'قطار', icon: <Train className="h-5 w-5" />, value: 'قطار' },
          { id: 'tour', text: 'تور گروهی', icon: <Palmtree className="h-5 w-5" />, value: 'تور گروهی' }
        ]
      }
    ];
    
    // سوالات ویژه مقصدهای خارجی
    const internationalQuestions: QuizQuestion[] = [
      {
        id: 'passport_status',
        question: 'آیا پاسپورت معتبر دارید؟',
        options: [
          { id: 'yes', text: 'بله، پاسپورت معتبر دارم', icon: <span className="text-sm">✅</span>, value: 'دارد' },
          { id: 'no', text: 'خیر، نیاز به اقدام دارم', icon: <span className="text-sm">❌</span>, value: 'ندارد' },
          { id: 'expiring', text: 'پاسپورت دارم اما نزدیک به انقضاست', icon: <span className="text-sm">⚠️</span>, value: 'در حال انقضا' }
        ]
      },
      {
        id: 'travel_duration',
        question: `مدت زمان ایده‌آل برای اقامت در ${destName} چقدر است؟`,
        options: [
          { id: 'short', text: 'کمتر از ۵ روز', icon: <span className="text-sm">5️⃣</span>, value: 'کمتر از 5 روز' },
          { id: 'medium', text: '۵ تا ۱۰ روز', icon: <span className="text-sm">🔟</span>, value: '5 تا 10 روز' },
          { id: 'long', text: 'بیشتر از ۱۰ روز', icon: <span className="text-sm">1️⃣0️⃣+</span>, value: 'بیش از 10 روز' }
        ]
      }
    ];

    // سوالات ویژه مقصدهای خاص
    const specialQuestions: Record<string, QuizQuestion[]> = {
      'کیش': [
        {
          id: 'kish_activities',
          question: 'کدام فعالیت در کیش برای شما جذاب‌تر است؟',
          options: [
            { id: 'water', text: 'تفریحات آبی و غواصی', icon: <span className="text-sm">🏊</span>, value: 'تفریحات آبی' },
            { id: 'shopping', text: 'خرید از مراکز تجاری', icon: <span className="text-sm">🛍️</span>, value: 'خرید' },
            { id: 'historical', text: 'بازدید از جاذبه‌های تاریخی', icon: <span className="text-sm">🏛️</span>, value: 'جاذبه‌های تاریخی' },
            { id: 'nature', text: 'گشت و گذار در طبیعت', icon: <span className="text-sm">🌴</span>, value: 'طبیعت گردی' }
          ]
        }
      ],
      'استانبول': [
        {
          id: 'istanbul_interests',
          question: 'کدام جنبه استانبول برای شما جذاب‌تر است؟',
          options: [
            { id: 'historical', text: 'بناهای تاریخی و موزه‌ها', icon: <span className="text-sm">🕌</span>, value: 'بناهای تاریخی' },
            { id: 'shopping', text: 'مراکز خرید و بازارها', icon: <span className="text-sm">🛒</span>, value: 'مراکز خرید' },
            { id: 'bosphorus', text: 'گشت در تنگه بسفر', icon: <span className="text-sm">⛴️</span>, value: 'تنگه بسفر' },
            { id: 'food', text: 'غذاهای ترکی و کافه‌ها', icon: <span className="text-sm">🍽️</span>, value: 'غذاهای ترکی' }
          ]
        }
      ],
      'دبی': [
        {
          id: 'dubai_interests',
          question: 'بیشتر مایل به تجربه کدام وجه دبی هستید؟',
          options: [
            { id: 'luxury', text: 'هتل‌های لوکس و مراکز خرید', icon: <span className="text-sm">🏨</span>, value: 'هتل‌های لوکس' },
            { id: 'adventure', text: 'تفریحات هیجان‌انگیز و سافاری', icon: <span className="text-sm">🏎️</span>, value: 'تفریحات هیجانی' },
            { id: 'beach', text: 'سواحل و پارک‌های آبی', icon: <span className="text-sm">🏖️</span>, value: 'سواحل' },
            { id: 'modern', text: 'معماری مدرن و آسمان‌خراش‌ها', icon: <span className="text-sm">🏙️</span>, value: 'معماری مدرن' }
          ]
        }
      ]
      // می‌توان برای سایر مقصدهای خاص نیز سوالات اختصاصی تعریف کرد
    };
    
    // ترکیب سوالات مشترک با سوالات ویژه مقصد
    let destQuestions = [...commonQuestions];
    
    // افزودن سوالات مخصوص مقصدهای داخلی یا خارجی
    if (destinationType === 'domestic') {
      destQuestions = [...destQuestions, ...domesticQuestions];
    } else {
      destQuestions = [...destQuestions, ...internationalQuestions];
    }
    
    // افزودن سوالات مخصوص مقصدهای خاص
    if (specialQuestions[destName]) {
      destQuestions = [...destQuestions, ...specialQuestions[destName]];
    }
    
    return destQuestions;
  };

  // شروع آزمون سفر رویایی
  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid && name.trim() !== '') {
      // تبدیل شماره موبایل به فرمت انگلیسی
      const englishPhone = convertPersianToEnglish(phone);
      
      const userData = { phone: englishPhone, name, desiredDestination: destination };
      localStorage.setItem('travel_exam_user', JSON.stringify(userData));
      
      // ذخیره در localStorage برای استفاده نهایی
      localStorage.setItem('quiz_user_name', name);
      localStorage.setItem('quiz_user_phone', englishPhone);
      localStorage.setItem('quiz_user_desired_destination', destination);
      
      // ذخیره اطلاعات کاربر در دیتابیس حتی اگر کوییز را ادامه ندهد
      const initialUserData: Omit<UserInfo, 'timestamp'> = {
        name: name,
        phone: englishPhone,
        quizAnswers: {},
        travelDestination: '',
        desiredDestination: destination,
        score: 0
      };
      
      // افزودن کاربر به سیستم بدون ارسال پیامک در این مرحله
      console.log('ذخیره اطلاعات اولیه کاربر در دیتابیس');
      addUser(initialUserData);
      
      // تولید سوالات مرتبط با مقصد
      const destQuestions = generateDestinationQuestions(destination);
      setQuestions(destQuestions);
      setTotalSteps(destQuestions.length);
      
      // شروع کوییز
      setShowPhoneModal(false);
    } else {
      // نمایش خطا به کاربر
      alert('لطفاً نام و شماره موبایل معتبر وارد کنید');
    }
  };

  // محاسبه امتیاز کاربر و تعیین مقصد سفر مناسب
  const calculateResult = () => {
    // نتیجه بر اساس مقصد انتخابی مشخص می‌شود
    setTravelDestination(destination);
    setShowResult(true);
    triggerConfetti();
    
    // دریافت اطلاعات کاربر از localStorage
    const savedName = localStorage.getItem('quiz_user_name') || name || '';
    const savedPhone = localStorage.getItem('quiz_user_phone') || phone || '';
    const savedDesiredDestination = localStorage.getItem('quiz_user_desired_destination') || destination || '';
    
    if (!savedPhone || savedPhone.trim() === '') {
      console.error('شماره موبایل معتبر یافت نشد!');
      return; // توقف اگر شماره موبایل معتبر نیست
    }
    
    // تبدیل شماره موبایل به فرمت انگلیسی برای ذخیره
    const englishPhone = convertPersianToEnglish(savedPhone);
    
    // تهیه پیشنهاد متناسب با انتخاب‌های کاربر
    let packageType = 'استاندارد';
    let budgetEstimate = 0;
    
    // تعیین نوع پکیج بر اساس بودجه
    if (answers.budget_range === 'اقتصادی') {
      packageType = 'اقتصادی';
      budgetEstimate = 1;
    } else if (answers.budget_range === 'استاندارد') {
      packageType = 'استاندارد';
      budgetEstimate = 2;
    } else if (answers.budget_range === 'لوکس') {
      packageType = 'لوکس';
      budgetEstimate = 3;
    } else if (answers.budget_range === 'VIP') {
      packageType = 'VIP';
      budgetEstimate = 4;
    }
    
    // افزایش بودجه برای سفرهای خارجی
    const isInternational = destinations.international.some(dest => dest.name === savedDesiredDestination);
    if (isInternational) {
      budgetEstimate *= 2;
    }
    
    // افزایش بودجه بر اساس تعداد همراهان
    if (answers.travel_companions === 'با خانواده') {
      budgetEstimate *= 2.5;
    } else if (answers.travel_companions === 'با همسر/نامزد') {
      budgetEstimate *= 1.8;
    } else if (answers.travel_companions === 'با دوستان') {
      budgetEstimate *= 1.5;
    }
    
    // محاسبه امتیاز نهایی (برای نمایش)
    const totalScore = Math.round(budgetEstimate * 20);
    setScore(totalScore);
    
    // ذخیره اطلاعات کاربر در سیستم
    const userData: Omit<UserInfo, 'timestamp'> = {
      name: savedName,
      phone: englishPhone,
      quizAnswers: answers,
      travelDestination: savedDesiredDestination,
      desiredDestination: savedDesiredDestination,
      score: totalScore
    };
    
    // به‌روزرسانی اطلاعات کاربر در دیتابیس 
    console.log('به‌روزرسانی اطلاعات کاربر با نتایج کوییز');
    addUser(userData);
    
    // فقط در مرحله آخر پیامک ارسال شود
    console.log('ارسال پیامک به:', englishPhone, 'با نام:', savedName);
    
    // ارسال پیامک با استفاده از سرویس sendSMS
    sendSMS(englishPhone, savedName)
      .then(success => {
        if (success) {
          console.log('پیامک با موفقیت ارسال شد');
        } else {
          console.warn('ارسال پیامک با مشکل مواجه شد، تلاش با روش جایگزین...');
          // تلاش با روش جایگزین
          return sendSMSAlternative(englishPhone, savedName);
        }
      })
      .then(success => {
        if (success) {
          console.log('پیامک با موفقیت با روش جایگزین ارسال شد');
        }
      })
      .catch(error => {
        console.error('خطا در ارسال پیامک:', error);
      });
    
    // ذخیره اطلاعات در localStorage برای استفاده بعدی
    localStorage.setItem('travel_exam_user', JSON.stringify({
      phone: englishPhone,
      name: savedName,
      quizCompleted: true,
      destination: savedDesiredDestination,
      desiredDestination: savedDesiredDestination,
      score: totalScore,
      packageType: packageType,
      answers
    }));
  };

  // انتخاب گزینه
  const selectOption = (questionId: string, optionId: string) => {
    if (questions[step].multiple) {
      // حالت چند انتخابی
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      // حالت تک انتخابی
      const option = questions[step].options.find(opt => opt.id === optionId);
      if (option) {
        setAnswers({ ...answers, [questionId]: option.value });
        goToNextStep();
      }
    }
  };

  // حرکت به مرحله بعد
  const goToNextStep = () => {
    if (questions[step].multiple) {
      // در حالت چند انتخابی، ابتدا پاسخ‌ها را ذخیره می‌کنیم
      const selectedValues = questions[step].options
        .filter(opt => selectedOptions.includes(opt.id))
        .map(opt => opt.value);
      
      setAnswers({ ...answers, [questions[step].id]: selectedValues });
      setSelectedOptions([]);
    }
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
      setQuizCompleted(true);
    }
  };

  // محاسبه مبلغ وام پیشنهادی
  const calculateLoanAmount = () => {
    // مبلغ وام بر اساس نوع مقصد و بودجه کاربر
    const isInternational = destinations.international.some(dest => dest.name === destination);
    let baseAmount = isInternational ? 50 : 30;
    
    // تنظیم بر اساس بودجه انتخابی
    if (answers.budget_range === 'اقتصادی') {
      baseAmount *= 0.8;
    } else if (answers.budget_range === 'لوکس') {
      baseAmount *= 1.5;
    } else if (answers.budget_range === 'VIP') {
      baseAmount *= 2;
    }
    
    return Math.round(baseAmount);
  };

  // فرمت‌کردن اعداد به فارسی
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  // لیست مقصدهای داخلی و خارجی
  const destinations = {
    domestic: [
      { id: 1, name: 'کیش', price: '۳ میلیون', image: '/city-icons/kish.jpg' },
      { id: 2, name: 'مشهد', price: '۱.۵ میلیون', image: '/city-icons/mashhad.jpg' },
      { id: 3, name: 'شیراز', price: '۲ میلیون', image: '/city-icons/shiraz.jpg' },
      { id: 4, name: 'اصفهان', price: '۲.۲ میلیون', image: '/city-icons/isfahan.jpg' },
      { id: 5, name: 'قشم', price: '۲.۸ میلیون', image: '/city-icons/kish.jpg' },
      { id: 6, name: 'تبریز', price: '۲.۱ میلیون', image: '/city-icons/kish.jpg' },
      { id: 7, name: 'یزد', price: '۱.۸ میلیون', image: '/city-icons/kish.jpg' },
      { id: 8, name: 'رشت', price: '۲.۳ میلیون', image: '/city-icons/kish.jpg' },
      { id: 9, name: 'جنگل‌های شمال', price: '۲.۵ میلیون', image: '/city-icons/kish.jpg' },
    ],
    international: [
      { id: 101, name: 'استانبول', price: '۳.۵ میلیون', image: '/city-icons/istanbul.jpg' },
      { id: 102, name: 'آنتالیا', price: '۳.۲ میلیون', image: '/city-icons/antalia.jpg' },
      { id: 103, name: 'دبی', price: '۴ میلیون', image: '/city-icons/dubai.jpg' },
      { id: 104, name: 'تایلند', price: '۳.۹ میلیون', image: '/city-icons/thailand.jpg' },
      { id: 105, name: 'ارمنستان', price: '۲.۸ میلیون', image: '/city-icons/armenia.jpg' },
      { id: 106, name: 'گرجستان', price: '۳.۱ میلیون', image: '/city-icons/teflis.jpg' },
      { id: 107, name: 'روسیه', price: '۳.۶ میلیون', image: '/city-icons/russia.jpg' },
      { id: 108, name: 'قزاقستان', price: '۳.۳ میلیون', image: '/city-icons/kazakhstan.jpg' },
      { id: 109, name: 'مالزی', price: '۴.۲ میلیون', image: '/city-icons/kish.jpg' },
      { id: 110, name: 'پاریس', price: '۶.۵ میلیون', image: '/city-icons/paris.jpg' },
      { id: 111, name: 'آذربایجان', price: '۲.۹ میلیون', image: '/city-icons/kish.jpg' },
    ],
  };

  // اضافه کردن کد مربوط به بستن منو با کلیک خارج از آن
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showDestinations &&
        destinationsRef.current &&
        !destinationsRef.current.contains(event.target as Node)
      ) {
        // چک کنیم که کلیک روی input خود مقصد نباشد
        const destinationInput = document.getElementById('destination');
        if (destinationInput && !destinationInput.contains(event.target as Node)) {
          setShowDestinations(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDestinations]);

  // جلوگیری از بسته شدن منو وقتی داخل منو کلیک می‌شود
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // اضافه کردن عکس پیش‌فرض برای مقصدهایی که عکس ندارند
  const getImagePath = (path: string) => {
    // فقط شهرهایی که تصاویرشان وجود دارد
    const availableImages = ['kish', 'mashhad', 'shiraz', 'isfahan', 'istanbul', 'antalia', 'dubai', 'thailand', 'armenia', 'teflis', 'russia', 'kazakhstan', 'paris'];
    
    // استخراج نام فایل از مسیر
    const fileName = path.split('/').pop()?.split('.')[0];
    
    if (fileName && availableImages.includes(fileName)) {
      return path;
    }
    
    // استفاده از تصویر پیش‌فرض برای سایر مقصدها
    return '/city-icons/kish.jpg';
  };

  // بهبود عملکرد جستجو
  const filteredDestinations = destinations[selectedDestinationType].filter(dest => {
    const query = searchQuery.trim().toLowerCase();
    const name = dest.name.toLowerCase();
    
    // اگر جستجو خالی است، همه مقصدها را نمایش بده
    if (query === '') return true;
    
    // جستجوی دقیق
    return name.includes(query);
  });

  // انتخاب مقصد
  const handleDestinationSelect = (destName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDestination(destName);
    setShowDestinations(false);
  };

  // بخش نتیجه کوییز - نمایش پیشنهاد سفر
  const renderQuizResult = () => {
    // تعیین مسیر تصویر مقصد
    const getDestinationImage = () => {
      const imageName = 
        destination.toLowerCase().includes('استانبول') ? 'istanbul.jpg' :
        destination.toLowerCase().includes('دبی') ? 'dubai.jpg' :
        destination.toLowerCase().includes('آنتالیا') ? 'antalia.jpg' :
        destination.toLowerCase().includes('کیش') ? 'kish.jpg' :
        destination.toLowerCase().includes('مشهد') ? 'mashhad.jpg' :
        destination.toLowerCase().includes('شیراز') ? 'shiraz.jpg' :
        destination.toLowerCase().includes('اصفهان') ? 'isfahan.jpg' :
        'kish.jpg';
      
      return getImagePath(`/city-icons/${imageName}`);
    };

    return (
      <div className="text-center space-y-6">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">برنامه سفر شما آماده شد!</h2>
          <p className="text-gray-600">بر اساس پاسخ‌های شما، پیشنهاد ویژه ما برای سفر به {destination}:</p>
        </div>
        
        <div className="bg-gradient-to-r from-peyk-blue/10 to-peyk-blue-light/10 p-6 rounded-xl">
          <div className="flex flex-col items-center">
            <Badge className="mb-2 bg-peyk-blue">
              {destinations.international.some(d => d.name === destination) ? 'خارجی' : 'داخلی'}
            </Badge>
            <h3 className="text-3xl font-bold text-peyk-blue mb-2">{destination}</h3>
            <p className="text-gray-600 mb-4">
              {answers.travel_companions && `سفر ${answers.travel_companions} • `}
              {answers.travel_time && `${answers.travel_time}`}
            </p>
            
            <div className="w-full h-40 relative overflow-hidden rounded-lg mb-4">
              <img 
                src={getDestinationImage()} 
                alt={destination} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <p className="text-gray-600 font-bold mb-2">
              پکیج {answers.budget_range || 'استاندارد'} • با وام سفر {formatNumber(calculateLoanAmount())} میلیون تومانی
            </p>
            
            <div className="mt-4 bg-white rounded-lg p-4 shadow-sm w-full">
              <h4 className="font-bold text-gray-800 mb-2">پیشنهاد ویژه برای شما</h4>
              <p className="text-sm text-gray-600">اقساط ماهانه {formatNumber(Math.round(calculateLoanAmount() * 1000000 / 12 * 1.04 / 1000000))} میلیون تومان</p>
              <p className="text-sm text-gray-600">مدت بازپرداخت: ۱۲ ماه</p>
              {answers.travel_transport && (
                <p className="text-sm text-gray-600 mt-1">شامل بلیط {answers.travel_transport}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="text-right">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-700">
                  {name ? `${name} عزیز، ` : ''}
                  کارشناسان ما با شماره <a href={`tel:${convertPersianToEnglish(phone)}`} className="text-peyk-blue hover:underline">{phone}</a> تماس خواهند گرفت
                </span> تا 
                جزئیات بیشتر درباره سفر به {destination} را توضیح دهند.
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">به زودی با شما تماس خواهیم گرفت</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden">
      {showPhoneModal ? (
        <div className="text-center space-y-6">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">خب رفیق، آماده شروع هستی؟</h2>
            <p className="text-gray-600">برای دسترسی به آزمون و دریافت پیشنهاد ویژه سفر، شماره موبایلت رو بنویس.</p>
          </div>
          
          <form onSubmit={handleStartExam} className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">نام و نام خانوادگی</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمد محمدی"
                  dir="rtl"
                  className="w-full pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="destination" className="block text-sm font-medium mb-1">مقصد مورد نظر</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Map className="h-5 w-5 text-gray-400" />
                </div>
                <div className="relative w-full">
                  <Input
                    id="destination"
                    type="text"
                    value={destination}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDestinations(true);
                    }}
                    placeholder="انتخاب مقصد سفر..."
                    dir="rtl"
                    className="w-full pl-10 cursor-pointer"
                    readOnly
                  />
                  {destination && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDestination('');
                      }}
                      className="absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {showDestinations && (
                  <div 
                    ref={destinationsRef} 
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                    onClick={handleMenuClick}
                  >
                    <div className="p-2">
                      <div className="flex space-x-2 mb-2">
                        <Button 
                          type="button"
                          onClick={() => setSelectedDestinationType('domestic')}
                          variant={selectedDestinationType === 'domestic' ? 'default' : 'outline'}
                          size="sm" 
                          className={`flex-1 ${selectedDestinationType === 'domestic' ? 'bg-peyk-orange hover:bg-peyk-orange/90' : ''}`}
                        >
                          داخلی
                        </Button>
                        <Button 
                          type="button"
                          onClick={() => setSelectedDestinationType('international')}
                          variant={selectedDestinationType === 'international' ? 'default' : 'outline'}
                          size="sm" 
                          className={`flex-1 ${selectedDestinationType === 'international' ? 'bg-peyk-blue hover:bg-peyk-blue/90' : ''}`}
                        >
                          خارجی
                        </Button>
                      </div>
                      
                      <div className="relative mb-2">
                        <Input
                          type="text"
                          placeholder="جستجوی مقصد..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8"
                          dir="rtl"
                        />
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {filteredDestinations.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredDestinations.map(dest => (
                              <div 
                                key={dest.id}
                                onClick={(e) => handleDestinationSelect(dest.name, e)}
                                className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                              >
                                <div className="w-10 h-10 relative overflow-hidden rounded-md mr-2">
                                  <img src={getImagePath(dest.image)} alt={dest.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{dest.name}</p>
                                  <p className="text-xs text-gray-500">{dest.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-gray-500">مقصدی یافت نشد</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">شماره موبایل</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  required
                  dir="ltr"
                  className={`w-full pl-10 ${!phone ? '' : isPhoneValid ? 'border-green-500' : 'border-red-500'}`}
                />
              </div>
              {phone && !isPhoneValid && (
                <p className="text-red-500 text-sm mt-1">لطفاً یک شماره موبایل معتبر با فرمت ۰۹ وارد کنید</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                شماره موبایل می‌تواند با اعداد فارسی، عربی یا انگلیسی وارد شود. این شماره را فقط برای ارسال پیشنهادات سفر استفاده می‌کنیم.
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-peyk-blue to-peyk-blue-dark text-white font-bold py-3"
              disabled={!isPhoneValid}
            >
              شروع آزمون
            </Button>
          </form>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <Lock className="h-4 w-4 text-gray-400" />
            <p className="text-xs text-gray-500">اطلاعات شما کاملاً محرمانه خواهد ماند</p>
          </div>
        </div>
      ) : !quizCompleted ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-2">کوییز سفر رویایی به {destination}</h2>
            <p className="text-gray-600 text-center mb-4">با تکمیل این کوییز کوتاه، بهترین پیشنهاد سفر را دریافت کنید</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>سوال {step + 1} از {totalSteps}</span>
                <span>%{Math.round(((step) / totalSteps) * 100)}</span>
              </div>
              <Progress value={((step) / totalSteps) * 100} className="h-2 progress-bar" />
            </div>
          </div>
          
          {questions.length > 0 && step < questions.length ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">{questions[step].question}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[step].options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => selectOption(questions[step].id, option.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:border-peyk-blue ${
                      questions[step].multiple
                        ? selectedOptions.includes(option.id)
                          ? 'border-peyk-blue bg-peyk-blue/5'
                          : 'border-gray-200'
                        : answers[questions[step].id] === option.value
                        ? 'border-peyk-blue bg-peyk-blue/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        questions[step].multiple && selectedOptions.includes(option.id)
                          ? 'bg-peyk-blue text-white'
                          : answers[questions[step].id] === option.value
                          ? 'bg-peyk-blue text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {option.icon}
                      </div>
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          
          {questions[step]?.multiple && (
            <div className="flex justify-center">
              <Button onClick={goToNextStep} className="bg-peyk-blue hover:bg-peyk-blue-dark" disabled={selectedOptions.length === 0}>
                ادامه
              </Button>
            </div>
          )}
        </>
      ) : (
        renderQuizResult()
      )}
    </div>
  );
};

export default TravelQuiz; 