import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import apiClient from '../lib/services/apiClient';

const questions = [
  {
    text: 'وقتی می‌رسی به مقصد، اولین کاری که می‌کنی؟',
    options: [
      { label: 'دراز می‌کشم، بخوابم تا فردا!', value: 'A' },
      { label: 'موبایلمو درمیارم، سلفی با درخت هم می‌گیرم!', value: 'B' },
      { label: 'غر می‌زنم که چرا وای‌فای نمی‌گیره؟', value: 'C' },
      { label: 'می‌رم ببینم غذاشون چیه', value: 'D' },
      { label: 'چمدون‌مو زیر سرم می‌ذارم، می‌خوابم کنار لابی', value: 'E' },
      { label: 'به راننده می‌گم یه جا وایسه از سوپر آب معدنی ارزون بخرم', value: 'F' },
      { label: 'یه‌کم وسواس می‌گیرم ببینم تخت تمیزه یا نه', value: 'G' }
    ]
  },
  {
    text: 'برنامه‌ی روز دوم سفر ساعت ۷ صبحه. واکنش تو؟',
    options: [
      { label: 'من؟ هنوز ساعت بدنم خوابه!', value: 'A' },
      { label: 'چرا اینقدر زوده؟! تور باید از ۱۰ شروع شه!', value: 'B' },
      { label: 'یه آب به صورتم می‌زنم، اما اول استوری می‌ذارم', value: 'C' },
      { label: 'می‌پرم پایین، چون گفتن بوفه صبحونه بازه', value: 'D' },
      { label: 'خودم نمیام، با اسنپ‌فود بیدار می‌شم', value: 'E' },
      { label: 'با کم‌ترین هزینه، می‌رم خودم جاها رو ببینم', value: 'F' },
      { label: 'شروع می‌کنم غر زدن از شب قبل!', value: 'G' }
    ]
  },
  {
    text: 'غذای مقصد سلیقه تو نیست. چی کار می‌کنی؟',
    options: [
      { label: 'بی‌خیال، خواب بهتره', value: 'A' },
      { label: 'هیچی نمی‌خورم. می‌گم "فقط قرمه‌سبزی مامان خودم!"', value: 'B' },
      { label: 'دوتا ساندویچ از خونه آوردم، می‌خورم', value: 'C' },
      { label: 'فقط نون و ماست می‌خورم، غر می‌زنم', value: 'D' },
      { label: 'می‌رم دنبال رستوران با نور خوب برای عکاسی', value: 'E' },
      { label: 'اصلاً برای غذا اومدم! یه غذای جدید امتحان می‌کنم', value: 'F' },
      { label: 'دبه می‌کنم با لیدر که پولشو کم کنه!', value: 'G' }
    ]
  },
  {
    text: 'هم‌اتاقی‌ات شبا خروپف می‌کنه. تو چی کار می‌کنی؟',
    options: [
      { label: 'صدای خودم بیشتره! اون باید تحمل کنه', value: 'A' },
      { label: 'هدفون می‌ذارم، فیلم می‌بینم و می‌خوابم', value: 'B' },
      { label: 'به لیدر می‌گم اتاقمو عوض کنه', value: 'C' },
      { label: 'می‌رم بیرون رو نیمکت می‌خوابم', value: 'D' },
      { label: 'یه استوری از خروپفش می‌ذارم (با تگ خودش 😈)', value: 'E' },
      { label: 'خودمو می‌زنم به خواب، شاید درست شه', value: 'F' },
      { label: 'یه چک می‌زنم بهش، بعد عذرخواهی می‌کنم 😅', value: 'G' }
    ]
  },
  {
    text: 'توی گشت شهری چی بیشتر جذب توجهت می‌کنه؟',
    options: [
      { label: 'دکه‌ی فلافل!', value: 'A' },
      { label: 'نماهای خاص برای عکس', value: 'B' },
      { label: 'جاهایی که ورودی‌ش رایگانه', value: 'C' },
      { label: 'بازار محلی برای تست خوراکی‌ها', value: 'D' },
      { label: 'نیمکت سایه‌دار برای چرت بعد ناهار', value: 'E' },
      { label: 'غر زدن ملت که "چرا اینقد گرمه؟"', value: 'F' },
      { label: 'فقط دنبال جاهای تمیز و لوکس می‌گردم', value: 'G' }
    ]
  },
  {
    text: 'آخر سفر، تو بیشتر در مورد چی حرف می‌زنی؟',
    options: [
      { label: 'اینکه کی بخوابم جبران کنم', value: 'A' },
      { label: 'اینکه چه استوری‌هایی گرفتم!', value: 'B' },
      { label: 'اینکه اصلاً راضی نبودم!', value: 'C' },
      { label: 'اینکه چرا شام شب آخر کم بود', value: 'D' },
      { label: 'اینکه خرجش بالا بود ولی من کم خرج دادم', value: 'E' },
      { label: 'اینکه چقدر خوش گذشت با غذاهاش', value: 'F' },
      { label: 'اینکه بالش اتاقم سفت بود یا نرم', value: 'G' }
    ]
  }
];

const personalities = {
  A: '😴 خوابالو',
  B: '🤳 سلفی‌بگیر',
  C: '😒 غرغرو',
  D: '🍕 شکمو',
  E: '🐗 خروپف‌کن',
  F: '💸 خسیس',
  G: '👑 نازک‌نارنجی'
};

const TravelQuiz2: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleStartQuiz = async () => {
    if (!name || !phone) {
      toast({
        title: 'خطا',
        description: 'لطفاً نام و شماره موبایل را وارد کنید',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await apiClient.post('/quiz/quiz2', { name, phone });
      setQuizId(response.data.quizId);
      setStep(1);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'مشکلی در شروع کوییز رخ داده است',
        variant: 'destructive'
      });
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (newAnswers.length === questions.length) {
      submitQuiz(newAnswers);
    } else {
      setStep(step + 1);
    }
  };

  const submitQuiz = async (finalAnswers: string[]) => {
    try {
      const response = await apiClient.post('/quiz/quiz2/submit', { 
        quizId, 
        answers: finalAnswers 
      });
      setResult(response.data.result);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'مشکلی در ارسال نتایج کوییز رخ داده است',
        variant: 'destructive'
      });
    }
  };

  const renderStep = () => {
    if (result) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">نتیجه کوییز سفر شما:</h2>
          <div className="text-6xl mb-4">{result}</div>
          <p className="text-lg">
            {result === personalities.A && 'شما یک سفرباز خوابالو هستید که بیشتر دوست دارید استراحت کنید!'}
            {result === personalities.B && 'شما یک سفرباز سلفی‌باز هستید که دوست دارید هر لحظه را ثبت کنید!'}
            {result === personalities.C && 'شما یک سفرباز غرغرو هستید که همیشه انتقاد دارید!'}
            {result === personalities.D && 'شما یک سفرباز شکمو هستید که غذا برایتان مهم است!'}
            {result === personalities.E && 'شما یک سفرباز خروپف‌کن هستید که خواب برایتان اولویت دارد!'}
            {result === personalities.F && 'شما یک سفرباز باصرفه هستید که دوست دارید کمترین هزینه را داشته باشید!'}
            {result === personalities.G && 'شما یک سفرباز نازک‌نارنجی هستید که دنبال آسایش و تمیزی هستید!'}
          </p>
        </div>
      );
    }

    if (step === 0) {
      return (
        <div className="flex flex-col space-y-4">
          <Input 
            placeholder="نام شما" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            placeholder="شماره موبایل" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button onClick={handleStartQuiz}>شروع کوییز</Button>
        </div>
      );
    }

    const currentQuestion = questions[step - 1];
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{currentQuestion.text}</h2>
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <Button 
              key={option.value} 
              variant="outline" 
              className="w-full text-right"
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="mt-4 text-center">
          سوال {step} از {questions.length}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">کوییز سفر رویایی</h1>
      {renderStep()}
    </div>
  );
};

export default TravelQuiz2; 