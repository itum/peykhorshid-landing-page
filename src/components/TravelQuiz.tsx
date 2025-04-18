import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Plane, Map, Palmtree, Mountain, Car, Train, Anchor, Phone, User, Lock } from 'lucide-react';
import { addUser, sendSMS, sendSMSAlternative, UserInfo } from '@/lib/services/userService';
import { sendSMSWithJSONP, sendSMSWithIframe } from '@/lib/services/smsUtils';

// تابع تبدیل اعداد فارسی و عربی به انگلیسی
const convertToEnglishNumber = (str: string): string => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
  if (!str) return str;
  
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianNumbers[i], i.toString())
                   .replace(arabicNumbers[i], i.toString());
  }
  
  return result;
};

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

// سوالات آزمون
const questions: QuizQuestion[] = [
  {
    id: 'location',
    question: 'تمایل به چه نوع سفری دارید؟',
    options: [
      { id: 'domestic', text: 'سفر داخلی', icon: <Map className="h-5 w-5" />, value: 'داخلی' },
      { id: 'international', text: 'سفر خارجی', icon: <Plane className="h-5 w-5" />, value: 'خارجی' }
    ]
  },
  {
    id: 'activities',
    question: 'چه فعالیت‌هایی را در سفر ترجیح می‌دهید؟',
    multiple: true,
    options: [
      { id: 'beach', text: 'ساحل و دریا', icon: <Palmtree className="h-5 w-5" />, value: 'beach' },
      { id: 'hiking', text: 'طبیعت‌گردی و کوه', icon: <Mountain className="h-5 w-5" />, value: 'hiking' },
      { id: 'city', text: 'گشت‌وگذار شهری', icon: <Car className="h-5 w-5" />, value: 'city' },
      { id: 'cultural', text: 'جاذبه‌های تاریخی و فرهنگی', icon: <Anchor className="h-5 w-5" />, value: 'cultural' }
    ]
  },
  {
    id: 'duration',
    question: 'طول سفر شما چقدر است؟',
    options: [
      { id: 'short', text: 'کمتر از ۵ روز', icon: <span className="text-sm">۳-۵</span>, value: 'short' },
      { id: 'medium', text: '۵ تا ۱۰ روز', icon: <span className="text-sm">۵-۱۰</span>, value: 'medium' },
      { id: 'long', text: 'بیشتر از ۱۰ روز', icon: <span className="text-sm">۱۰+</span>, value: 'long' }
    ]
  },
  {
    id: 'season',
    question: 'چه فصلی را برای سفر ترجیح می‌دهید؟',
    options: [
      { id: 'spring', text: 'بهار', icon: <span className="text-sm">🌸</span>, value: 'spring' },
      { id: 'summer', text: 'تابستان', icon: <span className="text-sm">☀️</span>, value: 'summer' },
      { id: 'fall', text: 'پاییز', icon: <span className="text-sm">🍂</span>, value: 'fall' },
      { id: 'winter', text: 'زمستان', icon: <span className="text-sm">❄️</span>, value: 'winter' }
    ]
  },
  {
    id: 'budget',
    question: 'بودجه شما برای این سفر چقدر است؟',
    options: [
      { id: 'low', text: 'کمتر از ۳۰ میلیون تومان', icon: <span className="text-sm">💰</span>, value: 30 },
      { id: 'medium', text: '۳۰ تا ۷۰ میلیون تومان', icon: <span className="text-sm">💰💰</span>, value: 70 },
      { id: 'high', text: 'بیشتر از ۷۰ میلیون تومان', icon: <span className="text-sm">💰💰💰</span>, value: 100 }
    ]
  },
  {
    id: 'adventure',
    question: 'میزان ماجراجویی مورد نظر شما چقدر است؟',
    options: [
      { id: 'relax', text: 'آرام و راحت', icon: <span className="text-sm">🧘</span>, value: 30 },
      { id: 'balanced', text: 'متعادل', icon: <span className="text-sm">🚶</span>, value: 50 },
      { id: 'adventure', text: 'ماجراجویانه', icon: <span className="text-sm">🧗</span>, value: 70 },
      { id: 'extreme', text: 'هیجان شدید', icon: <span className="text-sm">🏄</span>, value: 100 }
    ]
  }
];

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
  const totalSteps = questions.length;
  const [showPhoneModal, setShowPhoneModal] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // جشن برای نمایش در پایان آزمون
  const triggerConfetti = () => {
    // ساده‌سازی شده، فقط نوار پیشرفت را تکمیل می‌کنیم
    // در نسخه واقعی می‌توان از کتابخانه canvas-confetti استفاده کرد
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.classList.add('complete');
    }
  };

  // بررسی معتبر بودن شماره موبایل
  const validatePhone = (value: string) => {
    const convertedValue = convertToEnglishNumber(value);
    const regex = /^09[0-9]{9}$/;
    return regex.test(convertedValue);
  };

  // به‌روزرسانی شماره موبایل
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setIsPhoneValid(validatePhone(value));
  };

  // شروع آزمون سفر رویایی
  const handleStartExam = () => {
    if (isPhoneValid) {
      const convertedPhone = convertToEnglishNumber(phone);
      
      // ذخیره اطلاعات اولیه کاربر در دیتابیس
      const userData: Omit<UserInfo, 'timestamp'> = {
        name: name,
        phone: convertedPhone,
        quizAnswers: {},
        travelDestination: '',
        score: 0
      };
      
      // افزودن کاربر به سیستم در زمان شروع آزمون
      addUser(userData);
      console.log('اطلاعات اولیه کاربر در دیتابیس ذخیره شد');
      
      // ذخیره در localStorage برای استفاده بعدی
      localStorage.setItem('travel_exam_user', JSON.stringify({ phone: convertedPhone, name }));
      localStorage.setItem('quiz_user_name', name);
      localStorage.setItem('quiz_user_phone', convertedPhone);
      
      setShowPhoneModal(false);
    }
  };

  // محاسبه امتیاز کاربر و تعیین مقصد سفر مناسب
  const calculateResult = () => {
    let totalScore = 0;
    let budgetScore = 0;
    let adventureScore = 0;
    let locationPreference = '';
    
    // محاسبه امتیاز بودجه
    if (answers.budget) {
      const budget = parseInt(answers.budget as string);
      budgetScore = budget;
      totalScore += budget;
    }
    
    // محاسبه امتیاز ماجراجویی
    if (answers.adventure) {
      const adventure = parseInt(answers.adventure as string);
      adventureScore = adventure;
      totalScore += adventure;
    }
    
    // ترجیح مکانی
    if (answers.location) {
      locationPreference = answers.location as string;
    }
    
    // تعیین مقصد سفر براساس امتیازات
    let destination = '';
    
    if (budgetScore <= 30) {
      if (adventureScore <= 30) {
        destination = locationPreference === 'داخلی' ? 'مشهد' : 'استانبول';
      } else {
        destination = locationPreference === 'داخلی' ? 'کیش' : 'دبی';
      }
    } else if (budgetScore <= 70) {
      if (adventureScore <= 50) {
        destination = locationPreference === 'داخلی' ? 'شیراز' : 'ارمنستان';
      } else {
        destination = locationPreference === 'داخلی' ? 'قشم' : 'آنتالیا';
      }
    } else {
      if (adventureScore <= 70) {
        destination = locationPreference === 'داخلی' ? 'اصفهان' : 'روسیه';
      } else {
        destination = locationPreference === 'داخلی' ? 'جنگل‌های شمال' : 'تایلند';
      }
    }
    
    setTravelDestination(destination);
    setScore(totalScore);
    setShowResult(true);
    triggerConfetti();
    
    // دریافت اطلاعات کاربر از localStorage
    const savedName = localStorage.getItem('quiz_user_name') || name || '';
    const savedPhone = localStorage.getItem('quiz_user_phone') || phone || '';
    
    if (!savedPhone || savedPhone.trim() === '') {
      console.error('شماره موبایل معتبر یافت نشد!');
      return; // توقف اگر شماره موبایل معتبر نیست
    }
    
    // تبدیل شماره موبایل به انگلیسی قبل از ذخیره و ارسال
    const convertedPhone = convertToEnglishNumber(savedPhone);
    
    // بروزرسانی اطلاعات کاربر در دیتابیس با نتایج آزمون
    const userData: Omit<UserInfo, 'timestamp'> = {
      name: savedName,
      phone: convertedPhone,
      quizAnswers: answers,
      travelDestination: destination,
      score: totalScore
    };
    
    // بروزرسانی اطلاعات کاربر در دیتابیس
    addUser(userData);
    console.log('اطلاعات کامل کاربر در دیتابیس بروزرسانی شد');
    
    // ارسال پیامک در پایان آزمون
    console.log('ارسال پیامک به:', convertedPhone, 'با نام:', savedName);
    
    // ارسال پیامک با استفاده از سرویس sendSMS
    sendSMS(convertedPhone, savedName)
      .then(success => {
        if (success) {
          console.log('پیامک با موفقیت ارسال شد');
        } else {
          console.warn('ارسال پیامک با مشکل مواجه شد، تلاش با روش جایگزین...');
          // تلاش با روش جایگزین
          return sendSMSAlternative(convertedPhone, savedName);
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
    
    // ذخیره اطلاعات کامل در localStorage
    localStorage.setItem('travel_exam_user', JSON.stringify({
      phone: convertedPhone,
      name: savedName,
      quizCompleted: true,
      destination: destination,
      score: totalScore,
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
    const destinations: Record<string, number> = {
      'مشهد': 20,
      'کیش': 30,
      'شیراز': 25,
      'قشم': 35,
      'اصفهان': 25,
      'جنگل‌های شمال': 40,
      'استانبول': 50,
      'دبی': 60,
      'ارمنستان': 45,
      'آنتالیا': 55,
      'روسیه': 80,
      'تایلند': 100
    };
    
    return destinations[travelDestination] || 50;
  };

  // فرمت‌کردن اعداد به فارسی
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fa-IR').format(num);
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
              <label htmlFor="name" className="block text-sm font-medium mb-1">نام و نام خانوادگی (اختیاری)</label>
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
                />
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
                  placeholder="مثال: 09123456789"
                  required
                  dir="ltr"
                  className={`w-full pl-10 ${!phone ? '' : isPhoneValid ? 'border-green-500' : 'border-red-500'}`}
                />
              </div>
              {phone && !isPhoneValid && (
                <p className="text-red-500 text-sm mt-1">لطفاً یک شماره موبایل معتبر وارد کنید</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                این شماره را فقط برای ارسال پیشنهادات سفر استفاده می‌کنیم و هرگز اسپم نمی‌کنیم.
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
            <h2 className="text-2xl font-bold text-center mb-2">چقدر می‌توانید سفر کنید؟</h2>
            <p className="text-gray-600 text-center mb-4">سفر رویایی خود را کشف کنید و هدیه ویژه دریافت کنید</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>سوال {step + 1} از {totalSteps}</span>
                <span>%{Math.round(((step) / totalSteps) * 100)}</span>
              </div>
              <Progress value={((step) / totalSteps) * 100} className="h-2 progress-bar" />
            </div>
          </div>
          
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
          
          {questions[step].multiple && (
            <div className="flex justify-center">
              <Button onClick={goToNextStep} className="bg-peyk-blue hover:bg-peyk-blue-dark" disabled={selectedOptions.length === 0}>
                ادامه
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">مقصد سفر شما مشخص شد!</h2>
            <p className="text-gray-600">با توجه به سلیقه و بودجه شما، بهترین مقصد سفر برای شما:</p>
          </div>
          
          <div className="bg-gradient-to-r from-peyk-blue/10 to-peyk-blue-light/10 p-6 rounded-xl">
            <div className="flex flex-col items-center">
              <Badge className="mb-2 bg-peyk-blue">{answers.location === 'داخلی' ? 'داخلی' : 'خارجی'}</Badge>
              <h3 className="text-3xl font-bold text-peyk-blue mb-2">{travelDestination}</h3>
              <p className="text-gray-600 mb-4">با وام سفر {formatNumber(calculateLoanAmount())} میلیون تومانی</p>
              
              <div className="mt-4 bg-white rounded-lg p-4 shadow-sm w-full">
                <h4 className="font-bold text-gray-800 mb-2">پیشنهاد ویژه برای شما</h4>
                <p className="text-sm text-gray-600">اقساط ماهانه {formatNumber(Math.round(calculateLoanAmount() * 1000000 / 12 * 1.04 / 1000000))} میلیون تومان</p>
                <p className="text-sm text-gray-600">مدت بازپرداخت: ۱۲ ماه</p>
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
                    کارشناسان ما با شماره <a href={`tel:${phone}`} className="text-peyk-blue hover:underline">{phone}</a> تماس خواهند گرفت
                  </span> تا 
                  جزئیات بیشتر درباره وام سفر به {travelDestination} را توضیح دهند.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">به زودی با شما تماس خواهیم گرفت</p>
        </div>
      )}
    </div>
  );
};

export default TravelQuiz; 