import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage, deleteImage, listImages, ImageInfo } from '@/lib/services/uploadService';
import { toast } from 'sonner';
import ImageSizeInfo from './ImageSizeInfo';

interface FooterEditFormProps {
  item: any;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onChange: (item: any) => void;
}

const FooterEditForm: React.FC<FooterEditFormProps> = ({
  item,
  onSave,
  onCancel,
  isSaving,
  onChange
}) => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // بارگذاری تصاویر موجود
  React.useEffect(() => {
    const loadImages = async () => {
      try {
        const imageList = await listImages();
        setImages(imageList);
      } catch (error) {
        console.error('خطا در بارگذاری تصاویر:', error);
      }
    };
    loadImages();
  }, []);

  // آپلود تصویر
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('فقط فایل‌های تصویری (PNG, JPG, JPEG, GIF, WEBP, SVG) مجاز هستند');
      return;
    }
    
    // بررسی سایز فایل (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('سایز فایل نباید بیشتر از 10MB باشد');
      return;
    }
    
    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const newImage: ImageInfo = {
        filename: result.filename,
        url: result.url,
        size: result.size,
        mimetype: result.mimetype
      };
      
      setImages(prev => [newImage, ...prev]);
      toast.success('تصویر با موفقیت آپلود شد');
    } catch (error) {
      console.error('خطا در آپلود تصویر:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  // حذف تصویر
  const handleDeleteImage = async (filename: string) => {
    try {
      await deleteImage(filename);
      setImages(prev => prev.filter(img => img.filename !== img));
      toast.success('تصویر حذف شد');
    } catch (error) {
      console.error('خطا در حذف تصویر:', error);
      toast.error('خطا در حذف تصویر');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    } else {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
    }
  };

  // انتخاب تصویر از گالری
  const handleSelectImage = (imageUrl: string, field: string) => {
    onChange({
      ...item,
      data: {
        ...item.data,
        [field]: imageUrl
      }
    });
    setShowImageGallery(false);
  };

  const handleAddItem = (arrayName: string) => {
    const newItem = arrayName === 'social_links' ? { type: '', url: '' } :
                   arrayName === 'services' ? { text: '', url: '' } :
                   arrayName === 'useful_links' ? { text: '', url: '' } :
                   arrayName === 'addresses' ? { title: '', address: '', mapUrl: '' } :
                   arrayName === 'support_phones' ? '' :
                   arrayName === 'badges' ? { image: '', url: '', alt: '' } : {};
    
    const updatedArray = [...(item.data?.[arrayName] || []), newItem];
    onChange({
      ...item,
      data: {
        ...item.data,
        [arrayName]: updatedArray
      }
    });
  };

  const handleRemoveItem = (arrayName: string, index: number) => {
    const updatedArray = item.data?.[arrayName]?.filter((_: any, i: number) => i !== index) || [];
    onChange({
      ...item,
      data: {
        ...item.data,
        [arrayName]: updatedArray
      }
    });
  };

  const handleArrayItemChange = (arrayName: string, index: number, field: string, value: string) => {
    const updatedArray = [...(item.data?.[arrayName] || [])];
    if (arrayName === 'support_phones') {
      updatedArray[index] = value;
    } else {
      updatedArray[index] = { ...updatedArray[index], [field]: value };
    }
    onChange({
      ...item,
      data: {
        ...item.data,
        [arrayName]: updatedArray
      }
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">عمومی</TabsTrigger>
          <TabsTrigger value="company">شرکت</TabsTrigger>
          <TabsTrigger value="links">لینک‌ها</TabsTrigger>
          <TabsTrigger value="contact">تماس</TabsTrigger>
          <TabsTrigger value="copyright">کپی‌رایت</TabsTrigger>
          <TabsTrigger value="styling">استایل</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات عمومی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  value={item.title || ''}
                  onChange={(e) => onChange({ ...item, title: e.target.value })}
                  placeholder="عنوان فوتر"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات شرکت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-description">توضیحات شرکت</Label>
                <Textarea
                  id="company-description"
                  value={item.data?.company_description || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      company_description: e.target.value
                    }
                  })}
                  placeholder="سامانه خرید اقساطی آنلاین و چک صیادی..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="company-name">نام شرکت</Label>
                <Input
                  id="company-name"
                  value={item.data?.company_name || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      company_name: e.target.value
                    }
                  })}
                  placeholder="پیک خورشید اهواز"
                />
              </div>
              <div>
                <Label htmlFor="company-url">آدرس وب‌سایت</Label>
                <Input
                  id="company-url"
                  value={item.data?.company_url || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      company_url: e.target.value
                    }
                  })}
                  placeholder="https://peykkhorshid.ir/"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>لینک‌های اجتماعی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(item.data?.social_links || []).map((link: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">لینک {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem('social_links', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`social-type-${index}`}>نوع</Label>
                      <Input
                        id={`social-type-${index}`}
                        value={link.type || ''}
                        onChange={(e) => handleArrayItemChange('social_links', index, 'type', e.target.value)}
                        placeholder="instagram"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`social-url-${index}`}>آدرس</Label>
                      <Input
                        id={`social-url-${index}`}
                        value={link.url || ''}
                        onChange={(e) => handleArrayItemChange('social_links', index, 'url', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem('social_links')}
                className="w-full"
              >
                <Plus className="h-4 w-4 ml-2" />
                افزودن لینک اجتماعی
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>خدمات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(item.data?.services || []).map((service: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">خدمت {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem('services', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`service-text-${index}`}>متن</Label>
                      <Input
                        id={`service-text-${index}`}
                        value={service.text || ''}
                        onChange={(e) => handleArrayItemChange('services', index, 'text', e.target.value)}
                        placeholder="خرید اقساطی"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`service-url-${index}`}>آدرس</Label>
                      <Input
                        id={`service-url-${index}`}
                        value={service.url || ''}
                        onChange={(e) => handleArrayItemChange('services', index, 'url', e.target.value)}
                        placeholder="/services"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem('services')}
                className="w-full"
              >
                <Plus className="h-4 w-4 ml-2" />
                افزودن خدمت
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>لینک‌های مفید</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(item.data?.useful_links || []).map((link: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">لینک {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem('useful_links', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`useful-text-${index}`}>متن</Label>
                      <Input
                        id={`useful-text-${index}`}
                        value={link.text || ''}
                        onChange={(e) => handleArrayItemChange('useful_links', index, 'text', e.target.value)}
                        placeholder="قوانین و مقررات"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`useful-url-${index}`}>آدرس</Label>
                      <Input
                        id={`useful-url-${index}`}
                        value={link.url || ''}
                        onChange={(e) => handleArrayItemChange('useful_links', index, 'url', e.target.value)}
                        placeholder="/terms"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem('useful_links')}
                className="w-full"
              >
                <Plus className="h-4 w-4 ml-2" />
                افزودن لینک مفید
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>آدرس‌ها</Label>
                {(item.data?.addresses || []).map((address: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 mt-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">آدرس {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem('addresses', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`address-title-${index}`}>عنوان</Label>
                        <Input
                          id={`address-title-${index}`}
                          value={address.title || ''}
                          onChange={(e) => handleArrayItemChange('addresses', index, 'title', e.target.value)}
                          placeholder="دفتر مرکزی"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`address-address-${index}`}>آدرس</Label>
                        <Textarea
                          id={`address-address-${index}`}
                          value={address.address || ''}
                          onChange={(e) => handleArrayItemChange('addresses', index, 'address', e.target.value)}
                          placeholder="اهواز، خیابان..."
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`address-map-${index}`}>لینک نقشه</Label>
                        <Input
                          id={`address-map-${index}`}
                          value={address.mapUrl || ''}
                          onChange={(e) => handleArrayItemChange('addresses', index, 'mapUrl', e.target.value)}
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('addresses')}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  افزودن آدرس
                </Button>
              </div>

              <div>
                <Label>شماره‌های پشتیبانی</Label>
                {(item.data?.support_phones || []).map((phone: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Input
                      value={phone}
                      onChange={(e) => handleArrayItemChange('support_phones', index, '', e.target.value)}
                      placeholder="09123456789"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem('support_phones', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('support_phones')}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  افزودن شماره پشتیبانی
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copyright" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات کپی‌رایت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="copyright-text">متن کپی‌رایت</Label>
                <Input
                  id="copyright-text"
                  value={item.data?.copyright_text || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      copyright_text: e.target.value
                    }
                  })}
                  placeholder="تمامی حقوق محفوظ است © ۱۴۰۴"
                />
              </div>
              <div>
                <Label htmlFor="developer-text">متن توسعه‌دهنده</Label>
                <Input
                  id="developer-text"
                  value={item.data?.developer_text || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      developer_text: e.target.value
                    }
                  })}
                  placeholder="طراحی و پیاده‌سازی شده توسط تجارت الکترونیک فراز"
                />
              </div>
              <div>
                <Label htmlFor="developer-url">آدرس توسعه‌دهنده</Label>
                <Input
                  id="developer-url"
                  value={item.data?.developer_url || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      developer_url: e.target.value
                    }
                  })}
                  placeholder="https://farazec.com"
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="developer-credit"
                  checked={item.data?.developer_credit !== false}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      developer_credit: e.target.checked
                    }
                  })}
                />
                <Label htmlFor="developer-credit">نمایش اعتبار توسعه‌دهنده</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نشان‌ها و گواهینامه‌ها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* اطلاعات سایز پیشنهادی */}
              <ImageSizeInfo 
                recommendedSize="80x80px" 
                description="سایز پیشنهادی نشان‌ها"
                className="mb-4"
              />

              {(item.data?.badges || []).map((badge: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">نشان {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem('badges', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {/* آپلود تصویر نشان */}
                    <div className="space-y-2">
                      <Label>آپلود تصویر نشان</Label>
                      <div 
                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          dragOver === `badge-${index}` 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={(e) => handleDragOver(e, `badge-${index}`)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file).then(() => {
                                // بعد از آپلود، URL را در فیلد تصویر قرار دهید
                                // این کار در handleImageUpload انجام می‌شود
                              });
                            }
                          }}
                          className="hidden"
                          id={`badge-upload-${index}`}
                          disabled={isUploading}
                        />
                        <label
                          htmlFor={`badge-upload-${index}`}
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {isUploading ? 'در حال آپلود...' : 'کلیک کنید یا فایل را بکشید'}
                          </span>
                        </label>
                      </div>
                      
                      {/* دکمه انتخاب از گالری */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImageGallery(true)}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        انتخاب از گالری
                      </Button>
                    </div>

                    {/* نمایش تصویر فعلی */}
                    {badge.image && (
                      <div className="space-y-2">
                        <Label>تصویر فعلی</Label>
                        <div className="relative inline-block">
                          <img
                            src={badge.image}
                            alt={badge.alt || 'نشان'}
                            className="w-16 h-16 object-contain border rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0"
                            onClick={() => handleArrayItemChange('badges', index, 'image', '')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor={`badge-image-${index}`}>آدرس تصویر</Label>
                      <Input
                        id={`badge-image-${index}`}
                        value={badge.image || ''}
                        onChange={(e) => handleArrayItemChange('badges', index, 'image', e.target.value)}
                        placeholder="/enamad.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`badge-url-${index}`}>لینک</Label>
                      <Input
                        id={`badge-url-${index}`}
                        value={badge.url || ''}
                        onChange={(e) => handleArrayItemChange('badges', index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`badge-alt-${index}`}>متن جایگزین</Label>
                      <Input
                        id={`badge-alt-${index}`}
                        value={badge.alt || ''}
                        onChange={(e) => handleArrayItemChange('badges', index, 'alt', e.target.value)}
                        placeholder="نماد اعتماد"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddItem('badges')}
                className="w-full"
              >
                <Plus className="h-4 w-4 ml-2" />
                افزودن نشان
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات استایل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bg-type">نوع پس‌زمینه</Label>
                <select
                  id="bg-type"
                  value={item.data?.background?.type || 'gradient'}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      background: { ...item.data?.background, type: e.target.value }
                    }
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="gradient">گرادیانت</option>
                  <option value="solid">رنگ یکنواخت</option>
                  <option value="image">تصویر</option>
                </select>
              </div>
              
              {item.data?.background?.type === 'gradient' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bg-from">رنگ شروع</Label>
                    <Input
                      id="bg-from"
                      value={item.data?.background?.from || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          background: { ...item.data?.background, from: e.target.value }
                        }
                      })}
                      placeholder="#f3f4f6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bg-to">رنگ پایان</Label>
                    <Input
                      id="bg-to"
                      value={item.data?.background?.to || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          background: { ...item.data?.background, to: e.target.value }
                        }
                      })}
                      placeholder="#e5e7eb"
                    />
                  </div>
                </div>
              )}

              {item.data?.background?.type === 'solid' && (
                <div>
                  <Label htmlFor="bg-solid">رنگ پس‌زمینه</Label>
                  <Input
                    id="bg-solid"
                    value={item.data?.background?.from || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        background: { ...item.data?.background, from: e.target.value }
                      }
                    })}
                    placeholder="#f3f4f6"
                  />
                </div>
              )}

              {item.data?.background?.type === 'image' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bg-image">آدرس تصویر</Label>
                    <Input
                      id="bg-image"
                      value={item.data?.background?.image || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          background: { ...item.data?.background, image: e.target.value }
                        }
                      })}
                      placeholder="/footer-bg.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bg-size">اندازه</Label>
                      <Input
                        id="bg-size"
                        value={item.data?.background?.size || ''}
                        onChange={(e) => onChange({
                          ...item,
                          data: {
                            ...item.data,
                            background: { ...item.data?.background, size: e.target.value }
                          }
                        })}
                        placeholder="cover"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bg-position">موقعیت</Label>
                      <Input
                        id="bg-position"
                        value={item.data?.background?.position || ''}
                        onChange={(e) => onChange({
                          ...item,
                          data: {
                            ...item.data,
                            background: { ...item.data?.background, position: e.target.value }
                          }
                        })}
                        placeholder="center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
        </Button>
      </div>

      {/* گالری تصاویر */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">انتخاب تصویر از گالری</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageGallery(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.filename} className="relative group">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => handleSelectImage(image.url, 'badge_image')}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(image.filename)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {image.filename}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                تصویری در گالری موجود نیست
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterEditForm;
