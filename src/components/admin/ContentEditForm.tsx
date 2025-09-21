import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { ContentItem } from '@/lib/services/contentService';

interface ContentEditFormProps {
  item: ContentItem;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onChange: (item: ContentItem) => void;
}

const ContentEditForm = ({ item, onSave, onCancel, isSaving, onChange }: ContentEditFormProps) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // تبدیل data به فرم ساده
    const data = typeof item.data === 'string' ? 
      (() => { try { return JSON.parse(item.data); } catch { return {}; } })() : 
      item.data || {};
    setFormData(data);
  }, [item]);

  const updateFormData = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onChange({ ...item, data: newData });
  };

  const addListItem = (key: string) => {
    const currentList = formData[key] || [];
    const newItem = key === 'items' ? { title: '', description: '' } : 
                   key === 'documents' ? '' : 
                   key === 'steps' ? { title: '', description: '' } :
                   { title: '', description: '' };
    updateFormData(key, [...currentList, newItem]);
  };

  const updateListItem = (key: string, index: number, field: string, value: string) => {
    const currentList = [...(formData[key] || [])];
    if (typeof currentList[index] === 'string') {
      currentList[index] = value;
    } else {
      currentList[index] = { ...currentList[index], [field]: value };
    }
    updateFormData(key, currentList);
  };

  const removeListItem = (key: string, index: number) => {
    Swal.fire({
      title: 'حذف آیتم؟',
      text: 'این عملیات غیرقابل بازگشت است. مایل به حذف هستید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف شود',
      cancelButtonText: 'انصراف',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const currentList = [...(formData[key] || [])];
        currentList.splice(index, 1);
        updateFormData(key, currentList);
        Swal.fire({
          title: 'حذف شد',
          text: 'آیتم با موفقیت حذف شد',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  };

  const renderBasicFields = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>اطلاعات پایه</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>صفحه</Label>
            <Input
              value={item.page}
              onChange={(e) => onChange({ ...item, page: e.target.value })}
              placeholder="مثل: home, quiz, quiz2"
            />
          </div>
          <div>
            <Label>کلید سکشن</Label>
            <Input
              value={item.section_key}
              onChange={(e) => onChange({ ...item, section_key: e.target.value })}
              placeholder="مثل: features, hero, steps"
            />
          </div>
        </div>
        <div>
          <Label>عنوان سکشن</Label>
          <Input
            value={item.title || ''}
            onChange={(e) => onChange({ ...item, title: e.target.value })}
            placeholder="عنوان نمایشی سکشن"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>ترتیب نمایش</Label>
            <Input
              type="number"
              value={item.sort_order || 0}
              onChange={(e) => onChange({ ...item, sort_order: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="checkbox"
              checked={!!item.is_active}
              onChange={(e) => onChange({ ...item, is_active: e.target.checked ? 1 : 0 })}
              className="rounded"
            />
            <Label>فعال</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFeaturesForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>ویژگی‌ها</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>عنوان اصلی</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="عنوان سکشن ویژگی‌ها"
          />
        </div>
        <div>
          <Label>توضیحات</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="توضیحات سکشن"
            rows={3}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>لیست ویژگی‌ها</Label>
            <Button type="button" size="sm" onClick={() => addListItem('items')}>
              <Plus className="h-4 w-4 ml-1" />
              افزودن ویژگی
            </Button>
          </div>
          {(formData.items || []).map((item: any, index: number) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">ویژگی {index + 1}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeListItem('items', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  value={item.title || ''}
                  onChange={(e) => updateListItem('items', index, 'title', e.target.value)}
                  placeholder="عنوان ویژگی"
                />
                <Textarea
                  value={item.description || ''}
                  onChange={(e) => updateListItem('items', index, 'description', e.target.value)}
                  placeholder="توضیحات ویژگی"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderPopularRoutesForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>مسیرهای پرتردد</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>عنوان اصلی</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="عنوان سکشن مسیرها"
          />
        </div>
        <div>
          <Label>توضیحات</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="توضیحات سکشن"
            rows={3}
          />
        </div>
        
        <Separator />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>تورهای داخلی</Label>
            <Button type="button" size="sm" onClick={() => addListItem('domestic_routes')}>
              <Plus className="h-4 w-4 ml-1" />
              افزودن تور
            </Button>
          </div>
          {(formData.domestic_routes || []).map((route: any, index: number) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">تور داخلی {index + 1}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeListItem('domestic_routes', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={route.to || ''}
                  onChange={(e) => updateListItem('domestic_routes', index, 'to', e.target.value)}
                  placeholder="مقصد (مثل: کیش)"
                />
                <Input
                  value={route.price || ''}
                  onChange={(e) => updateListItem('domestic_routes', index, 'price', e.target.value)}
                  placeholder="قیمت (مثل: ۷۵۰ هزار)"
                />
                <Input
                  value={route.image || ''}
                  onChange={(e) => updateListItem('domestic_routes', index, 'image', e.target.value)}
                  placeholder="تصویر (مثل: /city-icons/kish.jpg)"
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>تورهای خارجی</Label>
            <Button type="button" size="sm" onClick={() => addListItem('special_routes')}>
              <Plus className="h-4 w-4 ml-1" />
              افزودن تور
            </Button>
          </div>
          {(formData.special_routes || []).map((route: any, index: number) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">تور خارجی {index + 1}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeListItem('special_routes', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={route.to || ''}
                  onChange={(e) => updateListItem('special_routes', index, 'to', e.target.value)}
                  placeholder="مقصد (مثل: استانبول)"
                />
                <Input
                  value={route.price || ''}
                  onChange={(e) => updateListItem('special_routes', index, 'price', e.target.value)}
                  placeholder="قیمت (مثل: ۱.۷۸۰)"
                />
                <Input
                  value={route.image || ''}
                  onChange={(e) => updateListItem('special_routes', index, 'image', e.target.value)}
                  placeholder="تصویر (مثل: /city-icons/istanbul.jpg)"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStepsForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>مراحل</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>عنوان اصلی</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="عنوان سکشن مراحل"
          />
        </div>
        <div>
          <Label>توضیحات</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="توضیحات سکشن"
            rows={3}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>لیست مراحل</Label>
            <Button type="button" size="sm" onClick={() => addListItem('steps')}>
              <Plus className="h-4 w-4 ml-1" />
              افزودن مرحله
            </Button>
          </div>
          {(formData.steps || []).map((step: any, index: number) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">مرحله {index + 1}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeListItem('steps', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  value={step.title || ''}
                  onChange={(e) => updateListItem('steps', index, 'title', e.target.value)}
                  placeholder="عنوان مرحله"
                />
                <Textarea
                  value={step.description || ''}
                  onChange={(e) => updateListItem('steps', index, 'description', e.target.value)}
                  placeholder="توضیحات مرحله"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderGuaranteesForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>مدارک و تضامین</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>عنوان اصلی</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="عنوان سکشن"
          />
        </div>
        <div>
          <Label>توضیحات</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="توضیحات سکشن"
            rows={3}
          />
        </div>
        
        <Separator />
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>لیست مدارک</Label>
            <Button type="button" size="sm" onClick={() => addListItem('documents')}>
              <Plus className="h-4 w-4 ml-1" />
              افزودن مدرک
            </Button>
          </div>
          {(formData.documents || []).map((doc: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={doc}
                onChange={(e) => updateListItem('documents', index, '', e.target.value)}
                placeholder="نام مدرک"
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeListItem('documents', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        <div>
          <Label>تضامین کارکنان دولتی</Label>
          <Textarea
            value={formData.guarantees?.government?.description || ''}
            onChange={(e) => updateFormData('guarantees', {
              ...formData.guarantees,
              government: { ...formData.guarantees?.government, description: e.target.value }
            })}
            placeholder="توضیحات تضامین کارکنان دولتی"
            rows={2}
          />
        </div>

        <div>
          <Label>تضامین کارکنان خصوصی</Label>
          <Textarea
            value={formData.guarantees?.private?.description || ''}
            onChange={(e) => updateFormData('guarantees', {
              ...formData.guarantees,
              private: { ...formData.guarantees?.private, description: e.target.value }
            })}
            placeholder="توضیحات تضامین کارکنان خصوصی"
            rows={2}
          />
        </div>

        <div>
          <Label>تضامین صاحبان کسب و کار</Label>
          <Textarea
            value={formData.guarantees?.business?.description || ''}
            onChange={(e) => updateFormData('guarantees', {
              ...formData.guarantees,
              business: { ...formData.guarantees?.business, description: e.target.value }
            })}
            placeholder="توضیحات تضامین صاحبان کسب و کار"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderQuizBannerForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>بنر کوییز</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>عنوان</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="عنوان بنر"
          />
        </div>
        <div>
          <Label>توضیحات اصلی</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="توضیحات اصلی"
            rows={2}
          />
        </div>
        <div>
          <Label>توضیحات فرعی</Label>
          <Textarea
            value={formData.subtitle || ''}
            onChange={(e) => updateFormData('subtitle', e.target.value)}
            placeholder="توضیحات فرعی"
            rows={2}
          />
        </div>
        <div>
          <Label>متن دکمه</Label>
          <Input
            value={formData.button_text || ''}
            onChange={(e) => updateFormData('button_text', e.target.value)}
            placeholder="متن دکمه شروع"
          />
        </div>
        <div>
          <Label>متن پیام تکمیل شده</Label>
          <Textarea
            value={formData.completed_text || ''}
            onChange={(e) => updateFormData('completed_text', e.target.value)}
            placeholder="متن پیام برای کاربرانی که کوییز را تکمیل کرده‌اند. از {destination} برای جایگزینی مقصد استفاده کنید."
            rows={2}
          />
        </div>
        <div>
          <Label>متن دکمه تکرار</Label>
          <Input
            value={formData.retry_button || ''}
            onChange={(e) => updateFormData('retry_button', e.target.value)}
            placeholder="متن دکمه تکرار کوییز"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFormBySection = () => {
    switch (item.section_key) {
      case 'features':
        return renderFeaturesForm();
      case 'popular_routes':
        return renderPopularRoutesForm();
      case 'steps':
        return renderStepsForm();
      case 'guarantees':
        return renderGuaranteesForm();
      case 'quiz_banner':
        return renderQuizBannerForm();
      case 'quiz_content':
        return renderQuizQuestionsForm('کوییز سفر');
      case 'quiz2_content':
        return renderQuizQuestionsForm('کوییز سفر ۲');
      case 'footer':
        return renderFooterForm();
      default:
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>محتوای سفارشی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>عنوان</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="عنوان"
                  />
                </div>
                <div>
                  <Label>توضیحات</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="توضیحات"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const renderQuizQuestionsForm = (titleText: string) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>عنوان</Label>
          <Input
            value={formData.title || ''}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="عنوان کوییز"
          />
        </div>
        <div>
          <Label>توضیحات</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="توضیحات کوییز"
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <Label>سوال‌ها</Label>
          <Button type="button" size="sm" onClick={() => {
            const questions = Array.isArray(formData.questions) ? formData.questions : [];
            updateFormData('questions', [...questions, { id: '', question: '', multiple: false, options: [] }]);
          }}>
            <Plus className="h-4 w-4 ml-1" />
            افزودن سوال
          </Button>
        </div>

        {(formData.questions || []).map((q: any, qIndex: number) => (
          <div key={qIndex} className="border rounded p-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium">سوال {qIndex + 1}</span>
              <Button type="button" size="sm" variant="destructive" onClick={() => {
                Swal.fire({
                  title: 'حذف سوال؟',
                  text: 'این عملیات غیرقابل بازگشت است. مایل به حذف سوال هستید؟',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'بله، حذف شود',
                  cancelButtonText: 'انصراف',
                  reverseButtons: true
                }).then((result) => {
                  if (result.isConfirmed) {
                    const questions = [...(formData.questions || [])];
                    questions.splice(qIndex, 1);
                    updateFormData('questions', questions);
                    Swal.fire({ title: 'حذف شد', icon: 'success', timer: 1000, showConfirmButton: false });
                  }
                });
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label>شناسه سوال (برای کوییز ۱ بهتر است: location, activities, duration, season, budget, adventure)</Label>
                <Input
                  value={q.id || ''}
                  onChange={(e) => {
                    const questions = [...(formData.questions || [])];
                    questions[qIndex] = { ...q, id: e.target.value };
                    updateFormData('questions', questions);
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={!!q.multiple}
                  onChange={(e) => {
                    const questions = [...(formData.questions || [])];
                    questions[qIndex] = { ...q, multiple: e.target.checked };
                    updateFormData('questions', questions);
                  }}
                />
                <Label>چندگزینه‌ای</Label>
              </div>
            </div>

            <div className="mb-3">
              <Label>متن سوال</Label>
              <Input
                value={q.question || ''}
                onChange={(e) => {
                  const questions = [...(formData.questions || [])];
                  questions[qIndex] = { ...q, question: e.target.value };
                  updateFormData('questions', questions);
                }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>گزینه‌ها</Label>
                <Button type="button" size="sm" onClick={() => {
                  const questions = [...(formData.questions || [])];
                  const options = Array.isArray(q.options) ? q.options : [];
                  questions[qIndex] = { ...q, options: [...options, { label: '', value: '' }] };
                  updateFormData('questions', questions);
                }}>
                  <Plus className="h-4 w-4 ml-1" />
                  افزودن گزینه
                </Button>
              </div>

              {(q.options || []).map((opt: any, oIndex: number) => (
                <div key={oIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 items-center">
                  <Input
                    value={opt.label || ''}
                    onChange={(e) => {
                      const questions = [...(formData.questions || [])];
                      const options = [...(q.options || [])];
                      options[oIndex] = { ...opt, label: e.target.value };
                      questions[qIndex] = { ...q, options };
                      updateFormData('questions', questions);
                    }}
                    placeholder="متن گزینه"
                  />
                  <Input
                    value={opt.value || ''}
                    onChange={(e) => {
                      const questions = [...(formData.questions || [])];
                      const options = [...(q.options || [])];
                      options[oIndex] = { ...opt, value: e.target.value };
                      questions[qIndex] = { ...q, options };
                      updateFormData('questions', questions);
                    }}
                    placeholder="مقدار گزینه (برای بودجه/ماجراجویی می‌تواند عدد باشد)"
                  />
                  <div className="flex justify-end">
                    <Button type="button" size="sm" variant="destructive" onClick={() => {
                      Swal.fire({
                        title: 'حذف گزینه؟',
                        text: 'این عملیات غیرقابل بازگشت است. مایل به حذف گزینه هستید؟',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'بله، حذف شود',
                        cancelButtonText: 'انصراف',
                        reverseButtons: true
                      }).then((result) => {
                        if (result.isConfirmed) {
                          const questions = [...(formData.questions || [])];
                          const options = [...(q.options || [])];
                          options.splice(oIndex, 1);
                          questions[qIndex] = { ...q, options };
                          updateFormData('questions', questions);
                          Swal.fire({ title: 'حذف شد', icon: 'success', timer: 1000, showConfirmButton: false });
                        }
                      });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderFooterForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>تنظیمات فوتر</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => {
            // داده‌های پیش‌فرض مطابق فوتر فعلی سایت
            const defaults = {
              background: { type: 'gradient', from: '#f3f4f6', to: '#e5e7eb' },
              company_description: 'سامانه خرید اقساطی آنلاین و چک صیادی، با سفته الکترونیکی. همراه شما در مسیر خرید آسان و مطمئن.',
              social_links: [
                { type: 'instagram', url: '#' },
                { type: 'twitter', url: '#' },
                { type: 'linkedin', url: '#' },
                { type: 'facebook', url: '#' },
                { type: 'youtube', url: '#' }
              ],
              services: [
                { text: 'خرید بلیط هواپیما', url: 'https://peykkhorshid.ir/' },
                { text: 'تور داخلی و خارجی', url: 'https://peykkhorshid.ir/tours/' },
                { text: 'تورهای زیارتی', url: 'http://peykkhorshid.ir/tour/%D8%AA%D9%88%D8%B1-%D9%85%D8%B4%D9%87%D8%AF-%D9%88%DB%8C%DA%98%D9%87-%D9%85%DB%8C%D9%84%D8%A7%D8%AF-%D8%A7%D9%85%D8%A7%D9%85-%D8%B1%D8%B6%D8%A7-%D8%B9/' }
              ],
              useful_links: [
                { text: 'درباره ما', url: 'https://peykkhorshid.ir/aboutus/' },
                { text: 'شرایط اقساطی', url: 'https://peykkhorshid.ir/%d8%ae%d8%b1%db%8c%d8%af-%d9%82%d8%b3%d8%b7%db%8c-%d8%a2%d9%86%d9%84%d8%a7%db%8c%d9%86-%d9%be%db%8c%da%a9-%d8%ae%d9%88%d8%b1%d8%b4%db%8c%d8%af/' },
                { text: 'باشگاه مشتریان', url: 'https://club.peykkhorshid.ir/' },
                { text: 'تماس با ما', url: 'https://peykkhorshid.ir/contactus/' },
                { text: 'مجله', url: 'https://peykkhorshid.ir/mag/' }
              ],
              addresses: [
                { title: 'دفتر تهران:', address: 'سعادت آباد بلوار دریا تقاطع فرحزادی ساختمان صدف واحد یک', mapUrl: 'https://maps.google.com/?q=سعادت+آباد+بلوار+دریا+تقاطع+فرحزادی+ساختمان+صدف+واحد+یک' },
                { title: 'دفتر اهواز:', address: 'سی متری نبش چهارراه زند پلاک 117', mapUrl: 'https://maps.google.com/?q=اهواز+سی+متری+نبش+چهارراه+زند+پلاک+117' }
              ],
              support_phones: ['06135518880', '09902483117', '09018880438', '09017770438'],
              badges: [
                { image: '/enamad.jpg', url: '#' },
                { image: '/samadehi.png', url: '#' },
                { image: '/images/havapeymaei-keshvari.png', url: '#' },
                { image: '/images/hoghoghe-mosafer.png', url: '#' },
                { image: '/images/nerkhebilit.png', url: '#' }
              ]
            };
            setFormData(defaults);
            onChange({ ...item, data: defaults });
          }}>پر کردن خودکار از فوتر فعلی</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>نوع پس‌زمینه</Label>
            <select
              className="border rounded w-full px-2 py-1"
              value={formData.background?.type || 'gradient'}
              onChange={(e) => updateFormData('background', { ...(formData.background || {}), type: e.target.value })}
            >
              <option value="gradient">گرادینت</option>
              <option value="solid">رنگ ثابت</option>
            </select>
          </div>
          <div>
            <Label>رنگ از</Label>
            <Input
              placeholder="#f3f4f6"
              value={formData.background?.from || ''}
              onChange={(e) => updateFormData('background', { ...(formData.background || {}), from: e.target.value })}
            />
          </div>
          <div>
            <Label>تا رنگ</Label>
            <Input
              placeholder="#e5e7eb"
              value={formData.background?.to || ''}
              onChange={(e) => updateFormData('background', { ...(formData.background || {}), to: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>توضیحات شرکت</Label>
          <Textarea
            rows={3}
            value={formData.company_description || ''}
            onChange={(e) => updateFormData('company_description', e.target.value)}
          />
        </div>

        <Separator />
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>شبکه‌های اجتماعی</Label>
            <Button type="button" size="sm" onClick={() => addListItem('social_links') }>
              <Plus className="h-4 w-4 ml-1" /> افزودن لینک
            </Button>
          </div>
          {(formData.social_links || []).map((link: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input placeholder="type (instagram|twitter|linkedin|facebook|youtube)" value={link.type || ''}
                onChange={(e) => updateListItem('social_links', index, 'type', e.target.value)} />
              <Input placeholder="URL" value={link.url || ''}
                onChange={(e) => updateListItem('social_links', index, 'url', e.target.value)} />
              <div className="flex justify-end">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeListItem('social_links', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>خدمات ما (متن + لینک)</Label>
            <Button type="button" size="sm" onClick={() => addListItem('services') }>
              <Plus className="h-4 w-4 ml-1" /> افزودن مورد
            </Button>
          </div>
          {(formData.services || []).map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input placeholder="متن" value={item.text || ''}
                onChange={(e) => updateListItem('services', index, 'text', e.target.value)} />
              <Input placeholder="لینک" value={item.url || ''}
                onChange={(e) => updateListItem('services', index, 'url', e.target.value)} />
              <div className="flex justify-end">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeListItem('services', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>لینک‌های مفید (متن + لینک)</Label>
            <Button type="button" size="sm" onClick={() => addListItem('useful_links') }>
              <Plus className="h-4 w-4 ml-1" /> افزودن لینک
            </Button>
          </div>
          {(formData.useful_links || []).map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input placeholder="متن" value={item.text || ''}
                onChange={(e) => updateListItem('useful_links', index, 'text', e.target.value)} />
              <Input placeholder="لینک" value={item.url || ''}
                onChange={(e) => updateListItem('useful_links', index, 'url', e.target.value)} />
              <div className="flex justify-end">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeListItem('useful_links', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>آدرس‌ها</Label>
            <Button type="button" size="sm" onClick={() => addListItem('addresses') }>
              <Plus className="h-4 w-4 ml-1" /> افزودن آدرس
            </Button>
          </div>
          {(formData.addresses || []).map((addr: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input placeholder="عنوان (مثل: دفتر تهران)" value={addr.title || ''}
                onChange={(e) => updateListItem('addresses', index, 'title', e.target.value)} />
              <Input placeholder="آدرس" value={addr.address || ''}
                onChange={(e) => updateListItem('addresses', index, 'address', e.target.value)} />
              <Input placeholder="لینک نقشه گوگل (اختیاری)" value={addr.mapUrl || ''}
                onChange={(e) => updateListItem('addresses', index, 'mapUrl', e.target.value)} />
            </div>
          ))}
        </div>

        <Separator />
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>شماره‌های پشتیبانی</Label>
            <Button type="button" size="sm" onClick={() => addListItem('support_phones') }>
              <Plus className="h-4 w-4 ml-1" /> افزودن شماره
            </Button>
          </div>
          {(formData.support_phones || []).map((ph: string, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 items-center">
              <Input placeholder="شماره تلفن" value={ph || ''}
                onChange={(e) => updateListItem('support_phones', index, '', e.target.value)} />
              <div className="md:col-span-2 flex justify-end">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeListItem('support_phones', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>نمادها (تصویر + لینک)</Label>
            <Button type="button" size="sm" onClick={() => addListItem('badges') }>
              <Plus className="h-4 w-4 ml-1" /> افزودن نماد
            </Button>
          </div>
          {(formData.badges || []).map((badge: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input placeholder="آدرس تصویر" value={badge.image || ''}
                onChange={(e) => updateListItem('badges', index, 'image', e.target.value)} />
              <Input placeholder="لینک" value={badge.url || ''}
                onChange={(e) => updateListItem('badges', index, 'url', e.target.value)} />
              <div className="flex justify-end">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeListItem('badges', index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      {renderBasicFields()}
      {renderFormBySection()}
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button onClick={onSave} disabled={isSaving} className="bg-peyk-blue">
          {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
        </Button>
      </div>
    </div>
  );
};

export default ContentEditForm;
