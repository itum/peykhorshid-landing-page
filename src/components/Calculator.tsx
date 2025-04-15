import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Calculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(20000000); // 20 million tomans default
  const [duration, setDuration] = useState<number>(6); // 6 months default
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  
  // Constants
  const MAX_LOAN = 20000000; // 20 million tomans
  const MIN_LOAN = 100000000; // 100 million tomans
  const INTEREST_RATE = 0.04; // 4% fixed interest rate

  // Calculate payments whenever loan amount or duration changes
  useEffect(() => {
    calculatePayments(loanAmount, duration);
  }, [loanAmount, duration]);

  const calculatePayments = (principal: number, months: number) => {
    // Simple interest calculation (principal * (1 + rate * years))
    const interest = principal * INTEREST_RATE * (months / 12);
    const total = principal + interest;
    const monthly = total / months;
    
    setMonthlyPayment(Math.round(monthly));
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
    <section id="calculator" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">محاسبه اقساط</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            مبلغ و مدت بازپرداخت دلخواه خود را انتخاب کنید تا میزان اقساط ماهانه را محاسبه کنیم.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ وام</label>
            <div className="mb-4">
              <Slider
                defaultValue={[loanAmount]}
                min={MAX_LOAN}
                max={MIN_LOAN}
                step={10000000}
                onValueChange={handleLoanChange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatCurrency(MIN_LOAN)} تومان</span>
                <span>{formatCurrency(MAX_LOAN)} تومان</span>
              </div>
            </div>
            <div className="text-center text-2xl font-bold text-peyk-blue">
              {formatCurrency(loanAmount)} تومان
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">مدت بازپرداخت (ماه)</label>
            <Tabs defaultValue="6" className="w-full" onValueChange={(value) => handleDurationChange(parseInt(value))}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="6">۶ ماهه</TabsTrigger>
                <TabsTrigger value="12">۱۲ ماهه</TabsTrigger>
                <TabsTrigger value="24">۲۴ ماهه</TabsTrigger>
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
