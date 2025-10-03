import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Trash2, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface DurationOption {
  value: number;
  label: string;
}

interface CalculatorEditFormProps {
  item: any;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onChange: (item: any) => void;
}

const CalculatorEditForm: React.FC<CalculatorEditFormProps> = ({
  item,
  onSave,
  onCancel,
  isSaving,
  onChange
}) => {
  const [durationOptions, setDurationOptions] = useState<DurationOption[]>([
    { value: 6, label: "۶ ماهه" },
    { value: 12, label: "۱۲ ماهه" },
    { value: 24, label: "۲۴ ماهه" },
    { value: 36, label: "۳۶ ماهه" }
  ]);

  const parseData = () => {
    try {
      return item?.data ? (typeof item.data === 'string' ? JSON.parse(item.data) : item.data) : {
        title: '',
        description: '',
        min_loan: 20000000,
        max_loan: 100000000,
        default_loan: 100000000,
        default_duration: 6,
        interest_rate: 0.04,
        loan_step: 10000000,
        rounding_factor: 5000,
        duration_options: [
          { value: 6, label: "۶ ماهه" },
          { value: 12, label: "۱۲ ماهه" },
          { value: 24, label: "۲۴ ماهه" },
          { value: 36, label: "۳۶ ماهه" }
        ]
      };
    } catch {
      return {
        title: '',
        description: '',
        min_loan: 20000000,
        max_loan: 100000000,
        default_loan: 100000000,
        default_duration: 6,
        interest_rate: 0.04,
        loan_step: 10000000,
        rounding_factor: 5000,
        duration_options: [
          { value: 6, label: "۶ ماهه" },
          { value: 12, label: "۱۲ ماهه" },
          { value: 24, label: "۲۴ ماهه" },
          { value: 36, label: "۳۶ ماهه" }
        ]
      };
    }
  };

  const [data, setData] = useState(parseData());

  const updateItem = () => {
    const updatedItem = {
      ...item,
      data: {
        ...data,
        duration_options: durationOptions
      }
    };
    onChange(updatedItem);
  };

  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    
    const updatedItem = {
      ...item,
      data: { ...newData, duration_options: durationOptions }
    };
    onChange(updatedItem);
  };

  const addDurationOption = () => {
    const newOption = { value: 12, label: "۱۲ ماهه" };
    setDurationOptions([...durationOptions, newOption]);
    
    const newData = { ...data, duration_options: [...durationOptions, newOption] };
    const updatedItem = {
      ...item,
      data: newData
    };
    onChange(updatedItem);
  };

  const updateDurationOption = (index: number, field: 'value' | 'label', value: any) => {
    const updatedOptions = durationOptions.map((option, i) => 
      i === index ? { ...option, [field]: field === 'value' ? parseInt(value) || 0 : value } : option
    );
    setDurationOptions(updatedOptions);
    
    const newData = { ...data, duration_options: updatedOptions };
    const updatedItem = {
      ...item,
      data: newData
    };
    onChange(updatedItem);
  };

  const removeDurationOption = (index: number) => {
    if (durationOptions.length <= 1) {
      toast.error('حداقل یک گزینه مدت بازپرداخت باید وجود داشته باشد');
      return;
    }
    
    const updatedOptions = durationOptions.filter((_, i) => i !== index);
    setDurationOptions(updatedOptions);
    
    const newData = { ...data, duration_options: updatedOptions };
    const updatedItem = {
      ...item,
      data: newData
    };
    onChange(updatedItem);
  };

  const resetToDefaults = () => {
    const defaultData = {
      title: '',
      description: '',
      min_loan: 20000000,
      max_loan: 100000000,
      default_loan: 100000000,
      default_duration: 6,
      interest_rate: 0.04,
      loan_step: 10000000,
      rounding_factor: 5000,
      duration_options: [
        { value: 6, label: "۶ ماهه" },
        { value: 12, label: "۱۲ ماهه" },
        { value: 24, label: "۲۴ ماهه" },
        { value: 36, label: "۳۶ ماهه" }
      ]
    };
    
    setData(defaultData);
    setDurationOptions(defaultData.duration_options);
    
    const updatedItem = {
      ...item,
      data: defaultData
    };
    onChange(updatedItem);
    
    toast.success('تنظیمات به حالت پیش‌فرض بازگردانده شد');
  };

  return (
    <div className="space-y-6">
      {/* عنوان و توضیحات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>متن و توضیحات</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="calculator-title">عنوان اصلی</Label>
            <Input
              id="calculator-title"
              value={data.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="محاسبه اقساط"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="calculator-description">توضیحات</Label>
            <Textarea
              id="calculator-description"
              value={data.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="مبلغ و مدت بازپرداخت دلخواه خود را انتخاب کنید تا میزان اقساط ماهانه را محاسبه کنیم."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* تنظیمات وام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>تنظیمات وام</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-loan">حداقل مبلغ وام (تومان)</Label>
              <Input
                id="min-loan"
                type="number"
                value={data.min_loan || ''}
                onChange={(e) => handleFieldChange('min_loan', parseInt(e.target.value) || 0)}
                placeholder="۲۰,۰۰۰,۰۰۰"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="max-loan">حداکثر مبلغ وام (تومان)</Label>
              <Input
                id="max-loan"
                type="number"
                value={data.max_loan || ''}
                onChange={(e) => handleFieldChange('max_loan', parseInt(e.target.value) || 0)}
                placeholder="۱۰۰,۰۰۰,۰۰۰"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="default-loan">مبلغ پیش‌فرض وام (تومان)</Label>
              <Input
                id="default-loan"
                type="number"
                value={data.default_loan || ''}
                onChange={(e) => handleFieldChange('default_loan', parseInt(e.target.value) || 0)}
                placeholder="۱۰۰,۰۰۰,۰۰۰"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="loan-step">گام اسلایدر (تومان)</Label>
              <Input
                id="loan-step"
                type="number"
                value={data.loan_step || ''}
                onChange={(e) => handleFieldChange('loan_step', parseInt(e.target.value) || 0)}
                placeholder="۱۰,۰۰۰,۰۰۰"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="interest-rate">نرخ بهره ماهیانه (درصد)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                value={(data.interest_rate * 100) || ''}
                onChange={(e) => handleFieldChange('interest_rate', parseFloat(e.target.value) / 100 || 0)}
                placeholder="۴"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="rounding-factor">ضریب رند کردن قسط (تومان)</Label>
            <Input
              id="rounding-factor"
              type="number"
              value={data.rounding_factor || ''}
              onChange={(e) => handleFieldChange('rounding_factor', parseInt(e.target.value) || 0)}
              placeholder="۵,۰۰۰"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* گزینه‌های مدت بازپرداخت */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>گزینه‌های مدت بازپرداخت</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDurationOption}
              className="mr-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              افزودن گزینه
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="default-duration">مدت پیش‌فرض (ماه)</Label>
            <Input
              id="default-duration"
              type="number"
              value={data.default_duration || ''}
              onChange={(e) => handleFieldChange('default_duration', parseInt(e.target.value) || 0)}
              placeholder="۶"
              className="mt-1"
            />
          </div>
          
          <div className="space-y-3">
            <Label>گزینه‌های موجود:</Label>
            {durationOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <Label htmlFor={`duration-label-${index}`}>برچسب</Label>
                  <Input
                    id={`duration-label-${index}`}
                    value={option.label}
                    onChange={(e) => updateDurationOption(index, 'label', e.target.value)}
                    placeholder="۶ ماهه"
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`duration-value-${index}`}>مقدار (ماه)</Label>
                  <Input
                    id={`duration-value-${index}`}
                    type="number"
                    value={option.value}
                    onChange={(e) => updateDurationOption(index, 'value', parseInt(e.target.value) || 0)}
                    placeholder="۶"
                    className="mt-1"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDurationOption(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* دکمه‌های عملیات */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={resetToDefaults}
          disabled={isSaving}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          بازگردانی به پیش‌فرض
        </Button>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            انصراف
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="bg-peyk-blue hover:bg-peyk-blue-dark"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorEditForm;
