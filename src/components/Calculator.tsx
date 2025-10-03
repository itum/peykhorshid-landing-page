import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getSection } from '@/lib/services/contentService';

interface CalculatorData {
  title?: string;
  description?: string;
  min_loan?: number;
  max_loan?: number;
  default_loan?: number;
  interest_rate?: number;
  duration_options?: Array<{ value: number; label: string }>;
  rounding_factor?: number;
}

const Calculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000000); // 100 million tomans default
  const [duration, setDuration] = useState<number>(6); // 6 months default
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  
  // Dynamic data from API
  const [overrideTitle, setOverrideTitle] = useState<string | null>(null);
  const [overrideDescription, setOverrideDescription] = useState<string | null>(null);
  const [overrideData, setOverrideData] = useState<CalculatorData | null>(null);

  // Default constants (fallback)
  const MIN_LOAN = overrideData?.min_loan || 20000000; // 20 million tomans
  const MAX_LOAN = overrideData?.max_loan || 100000000; // 100 million tomans
  const DEFAULT_LOAN = overrideData?.default_loan || 100000000;
  const MONTHLY_INTEREST_RATE = overrideData?.interest_rate || 0.04; // 4% monthly interest rate
  const DURATION_OPTIONS = overrideData?.duration_options || [
    { value: 6, label: "۶ ماهه" },
    { value: 12, label: "۱۲ ماهه" },
    { value: 24, label: "۲۴ ماهه" },
    { value: 36, label: "۳۶ ماهه" }
  ];
  const ROUNDING_FACTOR = overrideData?.rounding_factor || 5000;

  // Load calculator configuration from API
  useEffect(() => {
    (async () => {
      const section = await getSection('home', 'calculator');
      if (section && section.data) {
        const data = typeof section.data === 'string' ? 
          (() => { 
            try { 
              return JSON.parse(section.data); 
            } catch { 
              return {}; 
            } 
          })() : 
          section.data;
        
        if (data.title) setOverrideTitle(data.title);
        if (data.description) setOverrideDescription(data.description);
        if (data) setOverrideData(data);
        
        // Set default loan amount if specified
        if (data.default_loan) {
          setLoanAmount(data.default_loan);
        }
        
        // Set default duration if specified
        if (data.default_duration) {
          setDuration(data.default_duration);
        }
      }
    })();
  }, []);

  // Calculate payments whenever loan amount or duration changes
  useEffect(() => {
    calculatePayments(loanAmount, duration);
  }, [loanAmount, duration, MONTHLY_INTEREST_RATE, ROUNDING_FACTOR]);

  const calculatePayments = (principal: number, months: number) => {
    // محاسبه کل مبلغ با سود ساده ماهیانه
    const totalInterest = principal * MONTHLY_INTEREST_RATE * months;
    const totalAmount = principal + totalInterest;
    const monthly = totalAmount / months;
    
    // رند کردن به بالا با ضرایب مشخص شده
    const roundedUp = Math.ceil(monthly / ROUNDING_FACTOR) * ROUNDING_FACTOR;
    
    setMonthlyPayment(roundedUp);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const handleLoanChange = (value: number[]) => {
    setLoanAmount(value[0]);
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);
  };

  return (
    <section id="calculator" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {overrideTitle || 'محاسبه اقساط'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {overrideDescription || 'مبلغ و مدت بازپرداخت دلخواه خود را انتخاب کنید تا میزان اقساط ماهانه را محاسبه کنیم.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ وام</label>
            <div className="mb-4">
              <Slider
                defaultValue={[loanAmount]}
                min={MIN_LOAN}
                max={MAX_LOAN}
                step={overrideData?.loan_step || 10000000}
                onValueChange={handleLoanChange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatCurrency(MAX_LOAN)} تومان</span>
                <span>{formatCurrency(MIN_LOAN)} تومان</span>
              </div>
            </div>
            <div className="text-center text-2xl font-bold text-peyk-blue">
              {formatCurrency(loanAmount)} تومان
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">مدت بازپرداخت (ماه)</label>
            <Tabs 
              defaultValue={duration.toString()} 
              className="w-full" 
              onValueChange={(value) => handleDurationChange(parseInt(value))}
            >
              <TabsList className={`grid grid-cols-${DURATION_OPTIONS.length} w-full`}>
                {DURATION_OPTIONS.map((option) => (
                  <TabsTrigger key={option.value} value={option.value.toString()}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg text-center text-gray-600 mb-2">قسط ماهانه</h3>
                <p className="text-2xl font-bold text-center text-peyk-orange">
                  {formatCurrency(monthlyPayment)} تومان
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
